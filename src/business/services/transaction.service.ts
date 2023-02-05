import Payment from '../models/payment';
import Transaction from '../models/transaction';
import User from '../models/user';
import Service from './service';
import { BehaviorSubject } from 'rxjs';

export default class TransactionService extends Service<Transaction> {
  public clear(): void {
    this.entities = new BehaviorSubject(new Map());
  }

  public generateTransactions(membersPaymentMap: Map<User, number>, toUser: User, payment: Payment): void {
    for (const [fromUser, memberPayment] of Array.from(membersPaymentMap.entries())) {
      if (fromUser.uid === toUser.uid) {
        continue;
      }

      const transaction = Transaction.create(memberPayment, payment, toUser, fromUser);
      this.addOrUpdateEntity(transaction);
    }
  }

  public replacePaymentMembers(usersCollection: Map<string, User>): void {
    for (const transaction of Array.from(this.entities.getValue().values())) {
      transaction.to = usersCollection.get(transaction.to.payerId) ?? transaction.to;
      transaction.from = usersCollection.get(transaction.from.payerId) ?? transaction.from;

      if (transaction.to.uid === transaction.from.uid) {
        this.deleteEntity(transaction.uid)
      }
    }
  }
}
