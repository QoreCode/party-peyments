import Model from '@business/core/model';

export default class UserEventProperties extends Model {
  private readonly _userUid: string;
  private _payedForUserUids: string[];

  public constructor(uid: string, userUid: string, payedForUserUids: string[] = []) {
    super(uid);

    this._uid = uid;
    this._userUid = userUid;
    this._payedForUserUids = payedForUserUids;
  }

  public static create(userUid: string, payedForUserUids: string[] = []): UserEventProperties {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new UserEventProperties(uid, userUid, payedForUserUids);
  }

  public get userUid(): string {
    return this._userUid;
  }

  public get payedForUserUids(): string[] {
    return this._payedForUserUids;
  }

  public addUserUidForPayed(userUid: string): void {
    this._payedForUserUids.push(userUid);
  }

  public setUserUidForPayed(userUids: string[]): void {
    this._payedForUserUids = userUids;
  }

  public removeUserUidForPayed(userUid: string): void {
    this._payedForUserUids = this._payedForUserUids.filter((payedForUserUid: string) => payedForUserUid !== userUid);
  }

  public hasPayedUserUid(userUid: string): boolean {
    return this._payedForUserUids.some((payedUserUid: string) => payedUserUid === userUid);
  }

  public toJson(): Record<string, any> {
    return {
      uid: this.uid,
      userUid: this._userUid,
      payedForUserUids: this._payedForUserUids,
    };
  }
}
