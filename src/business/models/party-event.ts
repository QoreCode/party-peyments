import Model from '../core/model';

export default class PartyEvent extends Model {
  private readonly _date: number;
  private readonly _name: string;
  private readonly _userIds: string[];

  public constructor(uid: string, date: number, name: string, userIds: string[]) {
    super(uid);

    this._date = date;
    this._name = name;
    this._userIds = userIds;
  }

  // todo: optimize
  public async addUserUid(userUid: string): Promise<void> {
    const isUserExist = this._userIds.some((existedUserId: string) => existedUserId === userUid);
    if (isUserExist) return;

    this._userIds.push(userUid);
  }

  public static create(name: string, userIds: string[]): PartyEvent {
    const date = Date.now();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new PartyEvent(uid, date, name, userIds);
  }

  public toJson(): Record<string, any> {
    return {
      id: this.uid,
      date: this._date,
      name: this._name,
      userIds: this._userIds
    }
  }
}
