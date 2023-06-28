import Model from '../core/model';

export default class User extends Model {
  private _name: string;
  private _card?: string;

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

  public set name(name: string) {
    this._name = name;
  }

  public get card(): string | undefined {
    return this._card;
  }

  public set card(card: string | undefined) {
    this._card = card;
  }

  public get normalizedCard(): string | undefined {
    return this._card?.split(/(.{4})/).join(' ');
  }

  public toJson(): Record<string, any> {
    const result = { uid: this.uid, name: this._name };

    if (this._card === undefined) {
      return result;
    }

    return { ...result, card: this.card }
  }
}
