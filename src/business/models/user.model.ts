import Model from '../core/model';

export default class User extends Model {
  private readonly _name: string;
  private readonly _card?: string;

  public constructor(uid: string, name: string, card?: string) {
    super(uid);

    this._uid = uid;
    this._name = name;
    this._card = card;
  }

  public static create(name: string, card?: string): User {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new User(uid, name, card);
  }

  public get name(): string {
    return this._name;
  }

  public get card(): string | undefined {
    return this._card;
  }

  public get normalizedCard(): string | undefined {
    return this._card?.split(/(.{4})/).join(' ');
  }

  public toJson(): Record<string, any> {
    return {
      uid: this.uid,
      name: this._name,
      card: this._card
    }
  }
}
