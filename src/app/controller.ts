import { evaluate } from 'mathjs';

import CalculationModification from './models/modifications/calculation-modification';
import ExcludeModification from './models/modifications/exclude-modification';
import Payment from './models/payment';
import Transaction from './models/transaction';
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

  public addUser(name: string): User {
    const user = User.create(name);
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

  public createTransactions(): Transaction[] {
    console.log();
    const payments = this.paymentService.getEntities();
    if (payments.length === 0) {
      throw new Error('No payments exist');
    }

    const users = this.userService.getEntities();
    if (users.length === 0) {
      throw new Error('No user exist');
    }

    this.transactionService.clear();

    for (const payment of payments) {
      const payedUser = this.userService.getEntityByUid(payment.userUid);
      if (payedUser === undefined) throw new Error(`Can't find user with id ${payment.userUid}`);

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

      const membersPaymentMap: Map<User, number> = new Map(members.map((member) => [member, membersUidPaymentMap.get(member.uid) ?? 0]));

      this.transactionService.generateTransactions(membersPaymentMap, payedUser, payment);
    }

    this.transactionService.getEntities().forEach((tr) => console.log(tr.getResult()));

    this.transactionService.mergeTransaction();

    return this.transactionService.getEntities();
  }
}
