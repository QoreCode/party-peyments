import CalculationModification from '@business/models/modifications/calculation-modification';

export default class PositiveCalculationModification extends CalculationModification {

  public static create(paymentUid: string, usersUid: string[], mathExpression: number): PositiveCalculationModification {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    return new PositiveCalculationModification(uid, paymentUid, usersUid, mathExpression);
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

  public isNegative(): boolean {
    return false;
  }
}
