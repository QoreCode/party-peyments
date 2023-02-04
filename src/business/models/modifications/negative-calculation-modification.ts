import CalculationModification from './calculation-modification';

export default class NegativeCalculationModification extends CalculationModification {

  public constructor(uid: string, paymentUid: string, usersUid: string[], mathExpression: number) {
    super(uid, paymentUid, usersUid, mathExpression);
  }

  // user - current modification user
  // member - any user evaluate in payment
  public applyModification(membersMap: Map<string, number>, paymentCheck: number): Map<string, number> {
    const defaultPaymentForEachMember = Math.round(paymentCheck / membersMap.size);
    const paymentForUsers = paymentCheck + this._paymentCheckModification;
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
}
