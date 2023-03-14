import Model from '../core/model';

export default class Payment extends Model {
  private _name: string;
  private readonly _date: number;
  private _money: number;
  private _userUid: string;
  private readonly _eventUid: string;
  private _isNew: boolean = true;

  public constructor(uid: string, name: string, userUid: string, money: number, eventUid: string, date: number, isNew: boolean) {
    super(uid);

    this._name = name;
    this._userUid = userUid;
    this._money = money;
    this._isNew = isNew;
    this._date = date;
    this._eventUid = eventUid;
  }

  public static create(name: string, userUid: string, money: number, eventUid: string): Payment {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    const date = Date.now();
    return new Payment(uid, name, userUid, money, eventUid, date, true);
  }

  public get money(): number {
    return this._money;
  }

  public set money(money: number) {
    this._money = money;
  }

  public get isNew(): boolean {
    return this._isNew;
  }

  public set isNew(isNew: boolean) {
    this._isNew = isNew;
  }

  public get dateLabel(): string {
    const date = new Date(this._date);
    const hours = date.getHours() < 9 ? `0${ date.getHours() }` : date.getHours();
    const minutes = date.getMinutes() < 9 ? `0${ date.getMinutes() }` : date.getMinutes();
    return `${ date.getDate() }.${ date.getMonth() + 1 }.${ date.getFullYear() } ${ hours }:${ minutes }`;
  }

  public get eventUid(): string {
    return this._eventUid;
  }

  public get userUid(): string {
    return this._userUid;
  }

  public set userUid(userUid: string) {
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
      isNew: this._isNew,
      userUid: this._userUid,
      money: this._money,
      date: this._date,
      eventUid: this._eventUid,
    }
  }
}
