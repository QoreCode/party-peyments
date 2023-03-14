import Model from '../core/model';

export default class User extends Model {
  private readonly _name: string;

  public constructor(uid: string, name: string) {
    super(uid);

    this._uid = uid;
    this._name = name;
  }

  public static create(name: string): User {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new User(uid, name);
  }

  public get name(): string {
    return this._name;
  }

  public toJson(): Record<string, any> {
    return {
      uid: this.uid,
      name: this._name
    }
  }
}
