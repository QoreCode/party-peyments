import CalculationModification from '../models/modifications/calculation-modification';
import NegativeCalculationModification from '../models/modifications/negative-calculation-modification';
import PositiveCalculationModification from '../models/modifications/positive-calculation-modification';

export default class CalculationModificationFactory {
  public static create(usersUid: string[], paymentUid: string, mathExpression: number): CalculationModification {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uid = self.crypto.randomUUID();
    if (mathExpression > 0) {
      return new PositiveCalculationModification(uid, paymentUid, usersUid, mathExpression);
    }

    return new NegativeCalculationModification(uid, paymentUid, usersUid, mathExpression);
  }
}
