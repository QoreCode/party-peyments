import Model from '../model';

export enum ModificationType {
  Calculation,
  Execution
}

export default abstract class Modification extends Model {
  protected readonly _uid: string;
  protected _paymentUid: string;

  protected constructor(uid: string, paymentUid: string) {
    super();

    this._uid = uid;
    this._paymentUid = paymentUid;
  }

  public get uid(): string {
    return this._uid;
  }

  public get paymentUid(): string {
    return this._paymentUid;
  }

  public abstract get type(): ModificationType;
}
