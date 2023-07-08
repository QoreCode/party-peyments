import Model from '@business/core/entity-model';
import { EntityNameList } from '@business/core/entity-list';

export default abstract class CalculationModification extends Model {
  protected _mathExpression: number;
  protected _usersUid: string[];
  protected _paymentUid: string;
  protected _comment?: string;

  public constructor(uid: string, paymentUid: string, usersUid: string[], mathExpression: number, comment?: string) {
    super(uid);

    this._mathExpression = mathExpression;
    this._usersUid = usersUid;
    this._paymentUid = paymentUid;
    this._comment = comment;
  }

  public get paymentUid(): string {
    return this._paymentUid;
  }

  public get usersUid(): string[] {
    return this._usersUid;
  }

  public set usersUid(userUids: string[]) {
    this._usersUid = userUids;
  }

  public get mathExpression(): number {
    return this._mathExpression;
  }

  public set mathExpression(mathExpression: number) {
    this._mathExpression = mathExpression;
  }

  public get hasComment(): boolean {
    return this._comment !== undefined;
  }

  public get comment(): string | undefined {
    return this._comment;
  }

  public set comment(comment: string | undefined) {
    this._comment = comment;
  }

  public get userPart(): number {
    return Math.round(this._mathExpression / this._usersUid.length);
  }

  public isUserInvolved(userUid: string): boolean {
    return this._usersUid.some((existedUserUid: string) => existedUserUid === userUid);
  }

  public removeUser(userUid: string): void {
    this._usersUid = this._usersUid.filter((existedUserUid: string) => existedUserUid !== userUid);
  }

  // user - current modification user
  // member - any user evaluate in payment
  /** bad idea to calc defaultPaymentForEachUser each time
   * @param membersMap Map<userId, payment> **/
  public abstract applyModification(membersMap: Map<string, number>, paymentCheck: number): Map<string, number>;

  public abstract isNegative(): boolean;

  public toJson(): Record<string, any> {
    const requiredData = {
      uid: this.uid,
      paymentUid: this._paymentUid,
      usersUid: this._usersUid,
      mathExpression: this._mathExpression
    };

    if (this._comment === undefined) {
      return requiredData;
    }

    return { ...requiredData, comment: this._comment };
  }

  public override get domain(): EntityNameList {
    return EntityNameList.calculationModification;
  }
}
