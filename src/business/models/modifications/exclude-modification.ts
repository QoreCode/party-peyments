import User from '@business/models/user.model';
import Model from '@business/core/model';

export default class ExcludeModification extends Model {
  private readonly _userUid: string;
  private readonly _paymentUid: string;

  public constructor(uid: string, paymentUid: string, userUid: string) {
    super(uid);

    this._userUid = userUid;
    this._paymentUid = paymentUid;
  }

  public static create(userUid: string, paymentUid: string): ExcludeModification {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new ExcludeModification(uid, paymentUid, userUid);
  }

  public get paymentUid(): string {
    return this._paymentUid;
  }

  public get userUid(): string {
    return this._userUid;
  }

  public applyModification(membersMap: Map<string, User>): Map<string, User> {
    if (!membersMap.has(this._userUid)) {
      throw new Error(`Member with id ${ this._userUid } doesn't exist in the members collection`);
    }

    membersMap.delete(this._userUid);

    return membersMap;
  }

  public toJson(): Record<string, any> {
    return {
      uid: this.uid,
      paymentUid: this._paymentUid,
      userUid: this._userUid
    }
  }
}
