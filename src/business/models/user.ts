import Model from '../core/model';

export default class User extends Model {
  private readonly _name: string;
  private _payerId: string;
  private _eventUid: string;

  public constructor(uid: string, name: string, eventUid: string, payerId?: string) {
    super(uid);

    this._uid = uid;
    this._name = name;
    this._eventUid = eventUid;
    this._payerId = payerId ?? uid;
  }

  public static create(name: string, eventUid: string, payerId?: string): User {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new User(uid, name, eventUid, payerId);
  }

  public get name(): string {
    return this._name;
  }

  public set payerId(payerId: string) {
    this._payerId = payerId;
  }

  public get payerId(): string {
    return this._payerId ?? this.uid;
  }

  public toJson(): Record<string, any> {
    return {
      id: this.uid,
      name: this._name,
      payerId: this.payerId
    }
  }
}
