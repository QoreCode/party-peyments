import Modification, { ModificationType } from './modification';

export default abstract class CalculationModification extends Modification {
  protected readonly _paymentCheckModification: number;
  protected readonly _usersUid: string[];

  protected constructor(uid: string, paymentUid: string, usersUid: string[], mathExpression: number) {
    super(uid, paymentUid);

    this._paymentCheckModification = mathExpression;
    this._usersUid = usersUid;
  }

  public get type(): ModificationType {
    return ModificationType.Calculation;
  }

  public abstract applyModification(membersMap: Map<string, number>, paymentMoney: number): Map<string, number>;
}
