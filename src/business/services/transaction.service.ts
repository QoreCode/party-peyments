import Transaction from '@business/models/transaction.model';
import EntityService from '@business/core/entity-service';
import { Injectable } from '@angular/core';
import User from '@business/models/user.model';
import PaymentService from '@business/services/payment.service';
import UserService from '@business/services/user.service';
import ExcludeModificationService from '@business/services/exclude-modification.service';
import CalculationModificationService from '@business/services/calculation-modification.service';
import Payment from '@business/models/payment.model';
import EventService from '@business/services/event.service';
import ApplicationStateService from '@business/services/application-state.service';

@Injectable({
  providedIn: 'root',
})
export default class TransactionService extends EntityService<Transaction> {
  protected _tableName: string = 'none';

  constructor(
    private _applicationStateService: ApplicationStateService,
    private _paymentService: PaymentService,
    private _userService: UserService,
    private _eventService: EventService,
    private _excludeModificationService: ExcludeModificationService,
    private _calculationModificationService: CalculationModificationService
  ) {
    super();
  }

  // TODO: refactor this shit
  public async createTransactions(eventUid: string): Promise<Transaction[]> {
    const event = await this._eventService.getEntityByUid(eventUid);
    if (event === undefined) {
      throw new Error('No event exist');
    }

    const payments = (await this._paymentService.getEntities()).filter((payment: Payment) => {
      return payment.eventUid === event.uid;
    });
    if (payments.length === 0) {
      throw new Error('No payments exist');
    }

    const users = (await this._userService.getEntities()).filter((user: User) => {
      return event.isUserInvolved(user.uid);
    });
    if (users.length === 0) {
      throw new Error('No user exist');
    }

    this.clear();

    for (const payment of payments) {
      if (payment.isNew) {
        continue;
      }

      const payedUser = await this._userService.getEntityByUid(payment.userUid);
      if (payedUser === undefined) throw new Error(`Can't find user with id ${ payment.userUid }`);

      let membersMap: Map<string, User> = new Map(users.map((user) => [user.uid, user]));

      // удаление не участвующих пользователей
      const excludeModifications = await this._excludeModificationService.getEntitiesByPaymentId(payment.uid);
      for (const excludeModification of excludeModifications) {
        membersMap = excludeModification.applyModification(membersMap);
      }

      const defaultPayment = Math.round(payment.money / membersMap.size);
      const members = Array.from(membersMap.values());
      let membersUidPaymentMap: Map<string, number> = new Map(members.map((member) => [member.uid, defaultPayment]));

      // расчет всех модификаций
      const calculationModifications = await this._calculationModificationService.getEntitiesByPaymentId(payment.uid);

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

      await this.generateTransactions(membersPaymentMap, payedUser, payment, eventUid, defaultMembersPaymentsMap);
    }

    const usersMap = new Map(users.map((user => [user.uid, user])));
    await this.replacePaymentMembers(usersMap);

    return this.getEntities();
  }

  private async generateTransactions(membersPaymentMap: Map<User, number>, toUser: User, payment: Payment, eventUid: string, originalValueMap: Map<string, number>): Promise<void> {
    for (const [fromUser, memberPayment] of Array.from(membersPaymentMap.entries())) {
      if (fromUser.uid === toUser.uid) {
        continue;
      }

      const modifications = await this._calculationModificationService.getEntitiesByPaymentAndUserId(payment.uid, fromUser.uid);

      const originalValue = originalValueMap.get(fromUser.uid) ?? 0;
      const transaction = Transaction.create(memberPayment, payment, toUser, fromUser, eventUid, modifications, originalValue);
      this.addOrUpdateEntity(transaction);
    }
  }

  private async replacePaymentMembers(usersCollection: Map<string, User>): Promise<void> {
    for (const transaction of await this.getEntities()) {
      const event = await this._eventService.getEntityByUid(transaction.eventUid);
      if (event === undefined) {
        throw new Error(`Can't find event with id ${ transaction.eventUid }`);
      }

      const userWhoPayedUid = event.findWhoPayedForUser(transaction.from.uid);
      if (userWhoPayedUid !== undefined) {
        if (transaction.to.uid === userWhoPayedUid) {
          this.deleteEntity(transaction.uid)
        } else {
          transaction.changePayer(usersCollection.get(userWhoPayedUid));
        }
      }
    }
  }

  // move to component
  public async getResult(): Promise<Map<string, Map<string, number>>> {
    const transactions = await this.getEntities();
    const result: Map<string, Map<string, number>> = new Map();

    for (const transaction of transactions) {
      if (!result.has(transaction.from.name)) {
        result.set(transaction.from.name, new Map());
      }

      const fromUserPayments = result.get(transaction.from.name) as Map<string, number>;
      const toUserPaymentSum = fromUserPayments?.get(transaction.to.name) ?? 0;
      fromUserPayments?.set(transaction.to.name, toUserPaymentSum + transaction.money);

      result.set(transaction.from.name, fromUserPayments);
    }

    for (const [fromUserName, fromUserPaymentsMap] of Array.from(result.entries())) {
      for (const [toUserName, toUserPaymentsSum] of Array.from(fromUserPaymentsMap.entries())) {
        const relatedUserPayments = result.get(toUserName);
        if (relatedUserPayments === undefined) {
          continue;
        }

        const relatedUserPaymentsToCurrentUser = relatedUserPayments.get(fromUserName);
        if (relatedUserPaymentsToCurrentUser === undefined) {
          continue;
        }

        if (toUserPaymentsSum === relatedUserPaymentsToCurrentUser) {
          relatedUserPayments.delete(fromUserName);
          fromUserPaymentsMap.delete(toUserName);
        } else if (toUserPaymentsSum > relatedUserPaymentsToCurrentUser) {
          fromUserPaymentsMap.set(toUserName, toUserPaymentsSum - relatedUserPaymentsToCurrentUser);
          relatedUserPayments.delete(fromUserName);
        } else {
          fromUserPaymentsMap.delete(toUserName);
          relatedUserPayments.set(fromUserName, relatedUserPaymentsToCurrentUser - toUserPaymentsSum);
        }
      }

      if (fromUserPaymentsMap.size === 0) {
        result.delete(fromUserName);
      }
    }

    return result;
  }

  createFromJson(data: Record<string, any>): Transaction {
    throw new Error(`Not implemented coz not needed`);
  }
}
