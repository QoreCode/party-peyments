import Model from '@business/core/model';
import User from '@business/models/user.model';
import Payment from '@business/models/payment.model';
import CalculationModification from '@business/models/modifications/calculation-modification';

export default class Transaction extends Model {
  private _money: number;
  private _to: User;
  private _from: User;
  private _reasonPrefix: string = '';
  private readonly _payment: Payment;
  private readonly _eventUid: string
  private readonly _modifications: CalculationModification[] = [];
  private readonly _originalValue: number;

  private constructor(uid: string, money: number, payment: Payment, to: User, from: User, eventUid: string, modifications: CalculationModification[] = [], originalValue: number = 1) {
    super(uid);

    this._uid = uid;
    this._money = money;
    this._to = to;
    this._from = from;
    this._payment = payment;
    this._eventUid = eventUid;
    this._modifications = modifications;
    this._originalValue = originalValue;
  }

  public static create(money: number, payment: Payment, to: User, from: User, eventUid: string, modifications: CalculationModification[], originalValue: number = 1): Transaction {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new Transaction(uid, money, payment, to, from, eventUid, modifications, originalValue);
  }

  public get modifications(): CalculationModification[] {
    return this._modifications;
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

  public get originalValue(): number {
    return this._originalValue;
  }

  public getText(): string {
    return `${ this._reasonPrefix }${ this.payment.name }`;
  }

  public changePayer(payer: User | undefined): void {
    if (payer === undefined) {
      return;
    }

    this._reasonPrefix = `(for ${ this._from.name }) `;
    this._from = payer;
  }

  public toJson(): Record<string, any> {
    throw new Error('Method not implemented coz not needed.');
  }
}
