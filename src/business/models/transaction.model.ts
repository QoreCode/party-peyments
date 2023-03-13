import Model from '@business/core/model';
import User from '@business/models/user.model';
import Payment from '@business/models/payment.model';

export default class Transaction extends Model {
  private _money: number;
  private _to: User;
  private _from: User;
  private _resonPrefix?: string;
  private readonly _payment: Payment;
  private readonly _eventUid: string

  private constructor(uid: string, money: number, payment: Payment, to: User, from: User, eventUid: string) {
    super(uid);

    this._uid = uid;
    this._money = money;
    this._to = to;
    this._from = from;
    this._payment = payment;
    this._eventUid = eventUid;
  }

  public static create(money: number, payment: Payment, to: User, from: User, eventUid: string): Transaction {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new Transaction(uid, money, payment, to, from, eventUid);
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

  public get eventUid(): string {
    return this._eventUid;
  }

  public get payment(): Payment {
    return this._payment;
  }

  public getText(): string {
    return `${ this.payment.name }: '${ this._from.name }' должен(на) скинуть '${ this._to.name }' ${ this._money }грн`;
  }

  public changePayer(payer: User | undefined): void {
    if (payer === undefined) {
      return;
    }

    this._resonPrefix = `Payed for ${ this._from.name }: `;
    this._from = payer;
  }

  public toJson(): Record<string, any> {
    throw new Error('Method not implemented coz not needed.');
  }
}
