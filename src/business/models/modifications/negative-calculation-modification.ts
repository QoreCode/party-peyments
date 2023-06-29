import CalculationModification from '@business/models/modifications/calculation-modification';

export default class NegativeCalculationModification extends CalculationModification {

  public static create(paymentUid: string, usersUid: string[], mathExpression: number): NegativeCalculationModification {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new NegativeCalculationModification(uid, paymentUid, usersUid, mathExpression);
  }

  // user - current modification user
  // member - any user evaluate in payment
  /** bad idea to calc defaultPaymentForEachUser each time
   * @param membersMap Map<userId, payment>
   * @param {Number} paymentCheck
   **/
  public applyModification(membersMap: Map<string, number>, paymentCheck: number): Map<string, number> {
    const defaultPaymentForEachMember = Math.round(paymentCheck / membersMap.size);
    const paymentForUsers = Number(paymentCheck) + Number(this._mathExpression);
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

  public isNegative(): boolean {
    return true;
  }
}
