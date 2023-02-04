import Model from './model';

export default class Payment extends Model {
  protected readonly _uid: string;
  private readonly _name: string;
  private readonly _money: number;
  private readonly _userUid: string;

  private constructor(uid: string, name: string, userUid: string, money: number) {
    super();

    this._uid = uid;
    this._name = name;
    this._userUid = userUid;
    this._money = money;
  }

  public static create(name: string, userUid: string, money: number): Payment {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new Payment(uid, name, userUid, money);
  }

  public get uid(): string {
    return this._uid;
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
}
