import Model from './model';

export default class User extends Model {
  protected readonly _uid: string;
  private _name: string;

  private constructor(uid: string, name: string) {
    super();

    this._uid = uid;
    this._name = name;
  }

  public static create(name: string): User {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new User(uid, name);
  }

  public get uid(): string {
    return this._uid;
  }

  public get name(): string {
    return this._name;
  }
}
