import CalculationModification from './models/modifications/calculation-modification';
import ExcludeModification from './models/modifications/exclude-modification';
import Payment from './models/payment';
import User from './models/user';
import { ModificationService } from './services/modification.service';
import Service from './services/service';
import TransactionService from './services/transaction.service';
import UserService from './services/user.service';
import CalculationModificationFactory from './tools/calculation-modification.factory';

export default class Controller {
  private paymentService: Service<Payment>;
  private userService: UserService;
  private transactionService: TransactionService;
  private modificationService: ModificationService;

  constructor() {
    this.paymentService = new Service<Payment>();
    this.userService = new UserService();
    this.transactionService = new TransactionService();
    this.modificationService = new ModificationService();
  }

  public addUser(name: string, payerId?: string): User {
    const user = User.create(name, payerId);
    this.userService.addEntity(user);

    return user;
  }

  public addPayment(name: string, payerUid: string, money: number): Payment {
    const payment = Payment.create(name, payerUid, money);
    this.paymentService.addEntity(payment);

    return payment;
  }

  public addModification(paymentUid: string, usersUid: string[], value: number): CalculationModification {
    const modification = CalculationModificationFactory.create(usersUid, paymentUid, value);
    this.modificationService.addEntity(modification);

    return modification;
  }

  public excludeFromPayment(paymentUid: string, userUid: string): ExcludeModification {
    const modification = ExcludeModification.create(userUid, paymentUid);
    this.modificationService.addEntity(modification);

    return modification;
  }

  public createTransactions(): Map<string, Map<string, number>> {
    const payments = this.paymentService.getEntities();
    if (payments.length === 0) {
      throw new Error('No payments exist');
    }

    const users = this.userService.getEntities();
    if (users.length === 0) {
      throw new Error('No user exist');
    }

    const usersMap = new Map(users.map((user => [user.uid, user])));
    this.transactionService.clear();

    for (const payment of payments) {
      const payedUser = this.userService.getEntityByUid(payment.userUid);
      if (payedUser === undefined) throw new Error(`Can't find user with id ${ payment.userUid }`);

      let membersMap: Map<string, User> = new Map(users.map((user) => [user.uid, user]));

      // удаление не участвующих пользователей
      const excludeModifications = this.modificationService.getExecutionModifications(payment.uid);
      for (const excludeModification of excludeModifications) {
        membersMap = excludeModification.applyModification(membersMap);
      }

      const defaultPayment = Math.round(payment.money / membersMap.size);
      const members = Array.from(membersMap.values());
      let membersUidPaymentMap: Map<string, number> = new Map(members.map((member) => [member.uid, defaultPayment]));

      // расчет всех модификаций
      const calculationModifications = this.modificationService.getCalculationModifications(payment.uid);
      for (const calculationModification of calculationModifications) {
        membersUidPaymentMap = calculationModification.applyModification(membersUidPaymentMap, payment.money);
      }

      const membersPaymentMap: Map<User, number> = new Map(members.map((member: User) => {
        return [member, membersUidPaymentMap.get(member.uid) ?? 0];
      }));

      this.transactionService.generateTransactions(membersPaymentMap, payedUser, payment);
    }

    this.transactionService.replacePaymentMembers(usersMap);

    const transactions = this.transactionService.getEntities();
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
}
