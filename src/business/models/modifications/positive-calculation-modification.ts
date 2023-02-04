import CalculationModification from './calculation-modification';

export default class PositiveCalculationModification extends CalculationModification {
  public constructor(uid: string, paymentUid: string, usersUid: string[], mathExpression: number) {
    super(uid, paymentUid, usersUid, mathExpression);
  }

  public applyModification(membersMap: Map<string, number>, paymentMoney: number): Map<string, number> {
    const paymentPerUser = Math.round(this._paymentCheckModification / this._usersUid.length);

    for (const userUid of this._usersUid) {
      const memberPayment = membersMap.get(userUid);
      if (memberPayment === undefined) {
        throw new Error(`Member with id ${userUid} doesn't exist in the members collection`);
      }

      membersMap.set(userUid, memberPayment + paymentPerUser);
    }


    return membersMap;
  }
}
