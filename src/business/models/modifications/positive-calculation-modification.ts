import Model from '@business/core/model';

export default class PositiveCalculationModification extends Model {
  protected _mathExpression: number;
  protected _usersUid: string[];
  protected _paymentUid: string;

  public constructor(uid: string, paymentUid: string, usersUid: string[], mathExpression: number) {
    super(uid);

    this._mathExpression = mathExpression;
    this._usersUid = usersUid;
    this._paymentUid = paymentUid;
  }

  public static create(paymentUid: string, usersUid: string[], mathExpression: number): PositiveCalculationModification {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new PositiveCalculationModification(uid, paymentUid, usersUid, mathExpression);
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

  public isUserInvolved(userUid: string): boolean {
    return this._usersUid.some((existedUserUid: string) => existedUserUid === userUid);
  }

  public removeUser(userUid: string): void {
    this._usersUid = this._usersUid.filter((existedUserUid: string) => existedUserUid !== userUid);
  }

  public applyModification(membersMap: Map<string, number>): Map<string, number> {
    const paymentPerUser = Math.round(this._mathExpression / this._usersUid.length);

    for (const userUid of this._usersUid) {
      const memberPayment = membersMap.get(userUid);
      if (memberPayment === undefined) {
        throw new Error(`Member with id ${ userUid } doesn't exist in the members collection`);
      }

      membersMap.set(userUid, memberPayment + paymentPerUser);
    }


    return membersMap;
  }

  public toJson(): Record<string, any> {
    return {
      uid: this.uid,
      paymentUid: this._paymentUid,
      usersUid: this._usersUid,
      mathExpression: this._mathExpression
    }
  }
}
