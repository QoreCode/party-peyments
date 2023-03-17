import Model from '../core/model';
import UserEventProperties from '@business/models/user-event-properties.model';

export default class PartyEvent extends Model {
  private readonly _date: number;
  private readonly _name: string;
  private readonly _usersEventProperties: UserEventProperties[];

  public constructor(uid: string, date: number, name: string, userEventProperties: UserEventProperties[]) {
    super(uid);

    this._date = date;
    this._name = name;
    this._usersEventProperties = userEventProperties;
  }

  // todo: optimize
  public async addUserUid(userUid: string): Promise<void> {
    const isUserExist = this.getUserEventPropertiesByUserUid(userUid) !== undefined;
    if (isUserExist) return;

    this._usersEventProperties.push(UserEventProperties.create(userUid));
  }

  public async addUsersUid(usersUid: string[]): Promise<void> {
    usersUid.forEach((userUid: string) => this.addUserUid(userUid));
  }

  public async removeUserUid(userUid: string): Promise<void> {
    const userIndex = this._usersEventProperties.findIndex((usersEventProperties: UserEventProperties) => {
      return usersEventProperties.userUid === userUid;
    });

    if (userIndex === -1) throw new Error(`User with id '${ userUid }' isn't exist in event '${ this.name }'`);

    this._usersEventProperties.splice(userIndex, 1);

    this._usersEventProperties.forEach((userEventProperties: UserEventProperties) => {
      userEventProperties.removeUserUidForPayed(userUid);
    })
  }

  public get name(): string {
    return this._name;
  }

  public get date(): number {
    return this._date;
  }

  public get usersEventProperties(): UserEventProperties[] {
    return this._usersEventProperties;
  }

  public get involvedUserUids(): string[] {
    return this._usersEventProperties.map((userEventProperties: UserEventProperties) => userEventProperties.userUid);
  }

  public getUserEventPropertiesByUserUid(userUid: string): UserEventProperties | undefined {
    return this._usersEventProperties.find((usersEventProperties: UserEventProperties) => usersEventProperties.userUid === userUid);
  }

  public isUserInvolved(userUid: string): boolean {
    return this._usersEventProperties.some((usersEventProperties: UserEventProperties) => usersEventProperties.userUid === userUid);
  }

  // user can have only one payer
  public findWhoPayedForUser(userUid: string): string | undefined {
    for (const usersEventProperties of this._usersEventProperties) {
      if (usersEventProperties.hasPayedUserUid(userUid)) {
        return usersEventProperties.userUid;
      }
    }

    return undefined;
  }

  public get dataLabel(): string {
    const date = new Date(this._date);
    return `${ date.getDate() }.${ date.getMonth() + 1 }.${ date.getFullYear() }`;
  }

  public static create(name: string, userUids: string[]): PartyEvent {
    const date = Date.now();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    const usersEventProperties = userUids.map((userUid: string) => UserEventProperties.create(userUid));
    return new PartyEvent(uid, date, name, usersEventProperties);
  }

  public toJson(): Record<string, any> {
    return {
      uid: this.uid,
      date: this._date,
      name: this._name,
      usersEventProperties: this._usersEventProperties.map((usersEventProperties: UserEventProperties) => usersEventProperties.toJson())
    }
  }
}
