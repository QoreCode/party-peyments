import { Injectable } from '@angular/core';
import BusinessStorageFactory from '@business/storages/factories/business-storage.factory';
import Transaction from '@business/modules/transaction/transaction.model';
import Payment from '@business/modules/payment/payment.model';
import User from '@business/modules/user/user.model';
import { EntityNameList } from '@business/core/entity-list';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';
import CalculationModification from '@business/modules/calculation-modification/models/calculation-modification.model';

@Injectable({
  providedIn: 'root',
})
export default class TransactionController {
  protected storageFactory: BusinessStorageFactory;

  constructor() {
    this.storageFactory = new BusinessStorageFactory();
  }

  // TODO: refactor this shit
  public async createTransactions(eventUid: string): Promise<void> {
    const eventStorage = this.storageFactory.getStorage(EntityNameList.partyEvent)
    const event = eventStorage.getById(eventUid);
    if (event === undefined) {
      throw new Error('No event exist');
    }

    const paymentsStorage = this.storageFactory.getStorage(EntityNameList.payment)
    const payments = paymentsStorage.getByParam('eventUid', eventUid);
    if (payments.length === 0) {
      throw new Error('No payments exist');
    }

    const userEventStorage = this.storageFactory.getStorage(EntityNameList.userEventProperties)
    const userEventProperties = userEventStorage.getByParam('eventUid', eventUid);
    if (userEventProperties.length === 0) {
      throw new Error('No payments exist');
    }

    const involvedUsersIds = new Set(userEventProperties.map((userEvent: UserEventProperties) => userEvent.userUid));
    const usersStorage = this.storageFactory.getStorage(EntityNameList.user)
    const involvedUsers = usersStorage.getByFilter((user: User) => involvedUsersIds.has(user.uid));
    if (involvedUsers.length === 0) {
      throw new Error('No user exist');
    }

    const involvedUsersMap = new Map(involvedUsers.map((user) => [user.uid, user]));
    const excludeModificationsStorage = this.storageFactory.getStorage(EntityNameList.excludeModification);
    const calculationModificationsStorage = this.storageFactory.getStorage(EntityNameList.calculationModification);

    const transactions: Transaction[] = [];

    for (const payment of payments) {
      const payedUser = payment.userUid === null ? undefined : involvedUsersMap.get(payment.userUid);
      if (payedUser === undefined) throw new Error(`Can't find user with id ${ payment.userUid }`);

      let membersMap: Map<string, User> = new Map(involvedUsers.map((user) => [user.uid, user]));

      // удаление не участвующих пользователей
      const excludeModifications = excludeModificationsStorage.getByParam('paymentUid', payment.uid);
      for (const excludeModification of excludeModifications) {
        membersMap = excludeModification.applyModification(membersMap);
      }

      const defaultPayment = Math.round(payment.money / membersMap.size);
      const members = Array.from(membersMap.values());
      let membersUidPaymentMap: Map<string, number> = new Map(members.map((member) => [member.uid, defaultPayment]));

      // расчет всех модификаций
      const calculationModifications = calculationModificationsStorage.getByParam('paymentUid', payment.uid);

      const negativeModifications = calculationModifications.filter((modification) => modification.isNegative());
      for (const calculationModification of negativeModifications) {
        membersUidPaymentMap = calculationModification.applyModification(membersUidPaymentMap, payment.money);
      }

      const defaultMembersPaymentsMap = new Map(Array.from(membersUidPaymentMap.entries()));

      const positiveModifications = calculationModifications.filter((modification) => !modification.isNegative());
      for (const calculationModification of positiveModifications) {
        membersUidPaymentMap = calculationModification.applyModification(membersUidPaymentMap, payment.money);
      }

      const membersPaymentMap: Map<User, number> = new Map(members.map((member: User) => {
        return [member, membersUidPaymentMap.get(member.uid) ?? 0];
      }));

      transactions.push(...this.generateTransactions(membersPaymentMap, payedUser, payment, eventUid, defaultMembersPaymentsMap));
    }

    console.log(`transactions`, transactions);

    this.replacePaymentMembers(involvedUsersMap, transactions, eventUid);

    const transactionsStorage = this.storageFactory.getStorage(EntityNameList.transaction);
    transactionsStorage.deleteAll();
    transactionsStorage.setList(transactions);
  }

  private generateTransactions(membersPaymentMap: Map<User, number>, toUser: User, payment: Payment, eventUid: string, originalValueMap: Map<string, number>): Transaction[] {
    const transactions = [];

    for (const [fromUser, memberPayment] of Array.from(membersPaymentMap.entries())) {
      if (fromUser.uid === toUser.uid) {
        continue;
      }

      const calculationModificationsStorage = this.storageFactory.getStorage(EntityNameList.calculationModification);
      const modifications = calculationModificationsStorage.getByFilter((calculationModification: CalculationModification) => {
        return calculationModification.paymentUid === payment.uid && calculationModification.isUserInvolved(fromUser.uid)
      });

      const originalValue = originalValueMap.get(fromUser.uid) ?? 0;
      const transaction = Transaction.create(memberPayment, payment, toUser, fromUser, eventUid, modifications, originalValue);
      transactions.push(transaction);
    }

    return transactions;
  }

  private replacePaymentMembers(usersCollection: Map<string, User>, transactions: Transaction[], eventUid: string): void {
    const partyEventStorage = this.storageFactory.getStorage(EntityNameList.partyEvent);
    const userEventPropsStorage = this.storageFactory.getStorage(EntityNameList.userEventProperties);

    for (const [index, transaction] of transactions.entries()) {
      const event = partyEventStorage.getById(transaction.eventUid);
      if (event === undefined) {
        throw new Error(`Can't find event with id ${ transaction.eventUid }`);
      }

      const userEventProperties = userEventPropsStorage.getByFilter((userEventProp: UserEventProperties) => {
        return userEventProp.eventUid === eventUid && userEventProp.hasPayedUserUid(transaction.from.uid);
      });
      if (userEventProperties.length > 1) {
        throw new Error(`Something went wrong`);
      } else if (userEventProperties.length === 0) {
        continue;
      }

      const userWhoPayedUid = userEventProperties[0].userUid;
      if (userWhoPayedUid !== undefined) {
        if (transaction.to.uid === userWhoPayedUid) {
          transactions.splice(index, 1);
        } else {
          transaction.changePayer(usersCollection.get(userWhoPayedUid));
        }
      }
    }
  }
}
