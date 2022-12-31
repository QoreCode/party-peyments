import Model from './model';
import Payment from './payment';
import User from './user';

export default class Transaction extends Model {
  protected _uid: string;
  private _money: number;
  private readonly _to: User;
  private readonly _from: User;
  private readonly _payment: Payment;
  private _subTransactions: string[] = [];

  private constructor(uid: string, money: number, payment: Payment, to: User, from: User) {
    super();

    this._uid = uid;
    this._money = money;
    this._to = to;
    this._from = from;
    this._payment = payment;
  }

  public static create(money: number, payment: Payment, to: User, from: User): Transaction {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new Transaction(uid, money, payment, to, from);
  }

  public get uid(): string {
    return this._uid;
  }

  public get from(): User {
    return this._from;
  }

  public get to(): User {
    return this._to;
  }

  public get money(): number {
    return this._money;
  }

  public set money(money: number) {
    this._money = money;
  }

  public addSubTransaction(subTransaction: string): void {
    this._subTransactions.push(subTransaction);
  }

  public get payment(): Payment {
    return this._payment;
  }

  public getResult(): string {
    const transactionsNames = [this.payment.name, ...this._subTransactions];
    return `${transactionsNames.join(', ')}: '${this._from.name}' должен(на) скинуть '${this._to.name}' ${this._money}грн`;
  }

  public getTableResult(): Record<string, any> {
    const transactionsNames = [this.payment.name, ...this._subTransactions];
    return {
      'За что': transactionsNames.join(', '),
      'Кто': this._from.name,
      'Кому': this._to.name,
      'Сколько': `${this._money} грн`,
    };
  }
}
