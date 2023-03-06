import Model from '../core/model';

export default class Payment extends Model {
  private readonly _name: string;
  private readonly _money: number;
  private readonly _userUid: string;
  private readonly _eventUid: string;

  public constructor(uid: string, name: string, userUid: string, money: number, eventUid: string) {
    super(uid);

    this._name = name;
    this._userUid = userUid;
    this._money = money;
    this._eventUid = eventUid;
  }

  public static create(name: string, userUid: string, money: number, eventUid: string): Payment {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new Payment(uid, name, userUid, money, eventUid);
  }

  public get money(): number {
    return this._money;
  }

  public get userUid(): string {
    return this._userUid;
  }

  public get name(): string {
    return this._name;
  }

  public toJson(): Record<string, any> {
    return {
      id: this.uid,
      name: this._name,
      userUid: this._userUid,
      money: this._money,
      eventUid: this._eventUid,
    }
  }
}
