import Model from '@business/core/model';

export default class NegativeCalculationModification extends Model {
  protected _mathExpression: number;
  protected _usersUid: string[];
  protected _paymentUid: string;

  public constructor(uid: string, paymentUid: string, usersUid: string[], mathExpression: number) {
    super(uid);

    this._mathExpression = mathExpression;
    this._usersUid = usersUid;
    this._paymentUid = paymentUid;
  }

  public static create(paymentUid: string, usersUid: string[], mathExpression: number): NegativeCalculationModification {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new NegativeCalculationModification(uid, paymentUid, usersUid, mathExpression);
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

  // user - current modification user
  // member - any user evaluate in payment
  /** bad idea to calc defaultPaymentForEachUser each time
   * @param membersMap Map<userId, payment> **/
  public applyModification(membersMap: Map<string, number>, paymentCheck: number): Map<string, number> {
    const defaultPaymentForEachMember = Math.round(paymentCheck / membersMap.size);
    const paymentForUsers = paymentCheck + this._mathExpression;
    const defaultPaymentForEachUser = Math.round(paymentForUsers / membersMap.size);
    const currentPaymentModification = defaultPaymentForEachMember - defaultPaymentForEachUser;
    const currentPaymentModificationForEachUser = Math.round(currentPaymentModification / this._usersUid.length);
    const currentPaymentModificationForEachMember = Math.round(currentPaymentModification / (membersMap.size - this._usersUid.length));

    const usersSet = new Set(this._usersUid);

    for (const memberUid of Array.from(membersMap.keys())) {
      const memberPayment = membersMap.get(memberUid) || 0;
      const newMemberPayment = usersSet.has(memberUid) ?
        memberPayment - currentPaymentModificationForEachUser :
        memberPayment + currentPaymentModificationForEachMember;

      membersMap.set(memberUid, newMemberPayment);
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
