import Payment from '../models/payment';
import Transaction from '../models/transaction';
import User from '../models/user';
import Service from './service';

interface RelatedTransactions {
  sameWay: { index: number, trans: Transaction }[],
  oppositeWay: { index: number, trans: Transaction }[]
}

export default class TransactionService extends Service<Transaction> {

  public clear(): void {
    this.entities = new Map();
  }

  public generateTransactions(membersPaymentMap: Map<User, number>, payedUser: User, payment: Payment): void {
    for (const [member, memberPayment] of Array.from(membersPaymentMap.entries())) {
      if (member.uid === payedUser.uid) {
        continue;
      }

      const transaction = Transaction.create(memberPayment, payment, payedUser, member);
      this.entities.set(transaction.uid, transaction);
    }
  }

  public mergeTransaction(): void {
    let hasChanges = false;

    let transactions = Array.from(this.entities.values());
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];

      if (transaction === undefined) {
        continue;
      }

      const relatedTransactions = this.getRelatedTransactions(transaction);
      if (relatedTransactions.sameWay.length === 0 && relatedTransactions.oppositeWay.length === 0) {
        continue;
      }

      for (const relatedTransaction of relatedTransactions.oppositeWay) {
        if (relatedTransaction.trans.money < transaction.money) {
          transaction.money = transaction.money - relatedTransaction.trans.money;
          delete transactions[relatedTransaction.index];

          hasChanges = true;
        } else {
          // will be processed on next iteration
        }
      }

      for (const relatedTransaction of relatedTransactions.sameWay) {
        transaction.money = transaction.money + relatedTransaction.trans.money;
        transaction.addSubTransaction(relatedTransaction.trans.payment.name);
        delete transactions[relatedTransaction.index];

        hasChanges = true;
      }
    }

    transactions = transactions.filter((tr) => !!tr);

    this.clear()
    this.entities = new Map(transactions.map((transaction) => [transaction.uid, transaction]));

    // костыль. пофиксить
    if (hasChanges) {
      this.mergeTransaction();
    }
  }

  private getRelatedTransactions(transaction: Transaction): RelatedTransactions {
    const transactions = Array.from(this.entities.values());

    return transactions.reduce((acc: RelatedTransactions, relatedTransaction, transIndex) => {
      if (relatedTransaction.uid === transaction.uid) return acc;

      if (relatedTransaction.to.uid === transaction.to.uid && relatedTransaction.from.uid === transaction.from.uid) {
        acc.sameWay.push({ index: transIndex, trans: relatedTransaction });
      }

      if (relatedTransaction.from.uid === transaction.to.uid && relatedTransaction.to.uid === transaction.from.uid) {
        acc.oppositeWay.push({ index: transIndex, trans: relatedTransaction });
      }

      return acc;
    }, { sameWay: [], oppositeWay: [] });
  }
}
