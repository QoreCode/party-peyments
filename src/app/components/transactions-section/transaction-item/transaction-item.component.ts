import { Component, Input, SimpleChanges } from '@angular/core';
import User from '@business/models/user.model';
import Transaction from '@business/models/transaction.model';
import { faChevronDown, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

export interface IUserTransactionItem {
  user: User,
  transactions: Transaction[]
}

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss']
})
export class TransactionItemComponent {
  public _transactions: Transaction[] = [];

  @Input() user!: User;

  @Input() set transactions(transactions: Transaction[]) {
    this._transactions = transactions;
    this.userTransactions = this.getUserTransactions();
  }

  @Input() transactionsMap!: Map<User, Map<User, number>>;
  public arrowIcon = faChevronDown;
  public infoIcon = faInfoCircle;
  public userTransactions: IUserTransactionItem[] = [];

  public isHiddenDetails: Map<string, boolean> = new Map();

  constructor(public toastr: ToastrService) {
  }

  ngOnInit() {
    this.userTransactions = this.getUserTransactions();
  }

  get transactions(): Transaction[] {
    return this._transactions;
  }

  public toggleIsHiddenDetails(transactionItem: IUserTransactionItem): void {
    const isHidden = this.isHiddenDetails.get(transactionItem.user.uid) ?? true;
    this.isHiddenDetails.set(transactionItem.user.uid, !isHidden);
  }

  public isHiddenItemDetails(transactionItem: IUserTransactionItem): boolean {
    return this.isHiddenDetails.get(transactionItem.user.uid) ?? true;
  }

  public getTransactionLabel(transaction: Transaction): string {
    return `${ transaction.getText() } ${ transaction.payment.dateLabel }`;
  }

  public getTransactionsSum(transactionItem: IUserTransactionItem): number {
    return transactionItem.transactions.reduce((acc: number, transaction: Transaction) => {
      acc += transaction.money;
      return acc;
    }, 0);
  }

  public getTotal(transactionItem: IUserTransactionItem): number {
    let total = this.getTransactionsSum(transactionItem);

    const oppositeMoney = this.getOppositeMoney(transactionItem);
    total = total < oppositeMoney ? 0 : total - oppositeMoney;

    return total;
  }

  public getOppositeMoneyTitle(userTransaction: IUserTransactionItem): string {
    return `${ userTransaction.user.name } pay to ${ this.user.name }`;
  }

  public getOppositeMoney(transactionItem: IUserTransactionItem): number {
    return this.transactionsMap.get(transactionItem.user)?.get(this.user) ?? 0;
  }

  public getUserTransactions(): IUserTransactionItem[] {
    const transactionsMap = new Map<User, Transaction[]>();

    this.transactions.forEach((transaction: Transaction) => {
      if (transaction.from.uid !== this.user.uid) {
        return;
      }

      const groupedTransactions = transactionsMap.get(transaction.to) ?? [];
      groupedTransactions.push(transaction);

      transactionsMap.set(transaction.to, groupedTransactions);
    });

    const result = [];

    for (const [user, transactions] of transactionsMap.entries()) {
      result.push({ user, transactions });
    }

    return result;
  }

  public copyCardNumber(card: string | undefined): void {
    if (card === undefined) {
      return;
    }

    navigator.clipboard.writeText(card).then(() => {
      this.toastr.success(`Copying to clipboard was successful!`);
    }, (err) => {
      this.toastr.error(`Could not copy text: ${ err }`);
    });
  }
}
