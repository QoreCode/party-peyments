import Model from '../../core/entity-model';
import { EntityNameList } from '@business/core/entity-list';

export default class Payment extends Model {
  private _name: string;
  private readonly _date: number;
  private _money: number;
  private _userUid: string | null;
  private readonly _eventUid: string | null;

  public constructor(uid: string, name: string, userUid: string | null, money: number, eventUid: string, date: number) {
    super(uid);

    this._name = name;
    this._userUid = userUid;
    this._money = money;
    this._date = date;
    this._eventUid = eventUid;
  }

  public static create(name: string, userUid: string | null, money: number, eventUid: string): Payment {
    const uid = self.crypto.randomUUID();
    const date = Date.now();
    return new Payment(uid, name, userUid, money, eventUid, date);
  }

  public get money(): number {
    return this._money;
  }

  public set money(money: number) {
    this._money = money;
  }

  public get dateLabel(): string {
    const date = new Date(this._date);
    const hours = date.getHours() < 9 ? `0${ date.getHours() }` : date.getHours();
    const minutes = date.getMinutes() < 9 ? `0${ date.getMinutes() }` : date.getMinutes();
    return `${ date.getDate() }.${ date.getMonth() + 1 }.${ date.getFullYear() } ${ hours }:${ minutes }`;
  }

  public get eventUid(): string | null {
    return this._eventUid;
  }

  public get userUid(): string | null {
    return this._userUid;
  }

  public set userUid(userUid: string | null) {
    this._userUid = userUid;
  }

  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get date(): number {
    return this._date;
  }

  public toJson(): Record<string, any> {
    return {
      uid: this.uid,
      name: this._name,
      userUid: this._userUid,
      money: this._money,
      date: this._date,
      eventUid: this._eventUid,
    }
  }

  public get domain(): EntityNameList {
    return EntityNameList.payment;
  }
}
