import User from '../user';
import Modification, { ModificationType } from './modification';

export default class ExcludeModification extends Modification {
  private readonly _userUid: string;

  protected constructor(uid: string, paymentUid: string, userUid: string) {
    super(uid, paymentUid);

    this._userUid = userUid;
  }

  public static create(userUid: string, paymentUid: string): ExcludeModification {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new ExcludeModification(uid, paymentUid, userUid);
  }

  public get type(): ModificationType {
    return ModificationType.Execution;
  }

  public applyModification(membersMap: Map<string, User>): Map<string, User> {
    if (!membersMap.has(this._userUid)) {
      throw new Error(`Member with id ${this._userUid} doesn't exist in the members collection`);
    }

    membersMap.delete(this._userUid);

    return membersMap;
  }
}
