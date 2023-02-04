import Model from './model';
import Payment from './payment';
import User from './user';

export default class Transaction extends Model {
  protected _uid: string;
  private _money: number;
  private _to: User;
  private _from: User;
  private readonly _payment: Payment;

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

  public set from(user: User) {
    this._from = user;
  }

  public get from(): User {
    return this._from;
  }

  public set to(user: User) {
    this._to = user;
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

  public get payment(): Payment {
    return this._payment;
  }

  public getText(): string {
    return `${ this.payment.name }: '${ this._from.name }' должен(на) скинуть '${ this._to.name }' ${ this._money }грн`;
  }
}
