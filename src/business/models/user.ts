import Model from './model';

export default class User extends Model {
  protected readonly _uid: string;
  private readonly _name: string;
  private _payerId: string;

  private constructor(uid: string, name: string, payerId?: string) {
    super();

    this._uid = uid;
    this._name = name;
    this._payerId = payerId ?? uid;
  }

  public static create(name: string, payerId?: string): User {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new User(uid, name, payerId);
  }

  public get uid(): string {
    return this._uid;
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
}
