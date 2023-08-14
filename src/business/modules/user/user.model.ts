import Model from '../../core/entity-model';
import { EntityNameList } from '@business/core/entity-list';

export default class User extends Model {
  private _name: string;
  private _isActive: boolean;
  private _card?: string;

  public constructor(uid: string, name: string, isActive: boolean, card?: string) {
    super(uid);

    this._uid = uid;
    this._name = name;
    this._isActive = isActive;
    this._card = card;
  }

  public static create(name: string, isActive: boolean, card?: string): User {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new User(uid, name, isActive, card);
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public set isActive(isActive: boolean) {
    this._isActive = isActive;
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
    const result = { uid: this.uid, name: this._name, isActive: this.isActive };

    if (this._card === undefined) {
      return result;
    }

    return { ...result, card: this.card }
  }

  public get domain(): EntityNameList {
    return EntityNameList.user;
  }
}
