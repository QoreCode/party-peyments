import Model from '../../core/entity-model';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';
import { EntityNameList } from '@business/core/entity-list';

export default class PartyEvent extends Model {
  private readonly _date: number;
  private readonly _name: string;

  public constructor(uid: string, date: number, name: string) {
    super(uid);

    this._date = date;
    this._name = name;
  }

  // todo: optimize
  public async addUserUid(userUid: string): Promise<void> {
    const isUserExist = this.getUserEventPropertiesByUserUid(userUid) !== undefined;
    if (isUserExist) return;

    // this._usersEventProperties.push(UserEventProperties.create(userUid));
  }

  public async addUsersUid(usersUid: string[]): Promise<void> {
    usersUid.forEach((userUid: string) => this.addUserUid(userUid));
  }

  public async removeUserUid(userUid: string): Promise<void> {
    // const userIndex = this._usersEventProperties.findIndex((usersEventProperties: UserEventProperties) => {
    //   return usersEventProperties.userUid === userUid;
    // });
    //
    // if (userIndex === -1) throw new Error(`User with id '${ userUid }' isn't exist in event '${ this.name }'`);
    //
    // this._usersEventProperties.splice(userIndex, 1);
    //
    // this._usersEventProperties.forEach((userEventProperties: UserEventProperties) => {
    //   userEventProperties.removeUserUidForPayed(userUid);
    // })
  }

  public get name(): string {
    return this._name;
  }

  public get date(): number {
    return this._date;
  }

  public get usersEventProperties(): UserEventProperties[] {
    return [];
    // return this._usersEventProperties;
  }

  public get involvedUserUids(): string[] {
    return [];
    // return this._usersEventProperties.map((userEventProperties: UserEventProperties) => userEventProperties.userUid);
  }

  public getUserEventPropertiesByUserUid(userUid: string): UserEventProperties | undefined {
    return undefined;
    // return this._usersEventProperties.find((usersEventProperties: UserEventProperties) => usersEventProperties.userUid === userUid);
  }

  public isUserInvolved(userUid: string): boolean {
    return false;
    // return this._usersEventProperties.some((usersEventProperties: UserEventProperties) => usersEventProperties.userUid === userUid);
  }

  // user can have only one payer
  public findWhoPayedForUser(userUid: string): string | undefined {
    // for (const usersEventProperties of this._usersEventProperties) {
    //   if (usersEventProperties.hasPayedUserUid(userUid)) {
    //     return usersEventProperties.userUid;
    //   }
    // }

    return undefined;
  }

  public get dataLabel(): string {
    const date = new Date(this._date);
    return `${ date.getDate() }.${ date.getMonth() + 1 }.${ date.getFullYear() }`;
  }

  public static create(name: string): PartyEvent {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    const date = Date.now();
    return new PartyEvent(uid, date, name);
  }

  public toJson(): Record<string, any> {
    return {
      uid: this.uid,
      date: this._date,
      name: this._name,
    }
  }

  public get domain(): EntityNameList {
    return EntityNameList.partyEvent;
  }
}
