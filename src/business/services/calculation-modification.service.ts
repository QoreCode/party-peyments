import { Injectable } from '@angular/core';
import NegativeCalculationModification from '@business/models/modifications/negative-calculation-modification';
import PositiveCalculationModification from '@business/models/modifications/positive-calculation-modification';
import EntityService from '@business/core/entity-service';

export type CalculationModification = NegativeCalculationModification | PositiveCalculationModification;

@Injectable({
  providedIn: 'root',
})
export default class CalculationModificationService extends EntityService<CalculationModification> {
  protected _tableName: string = 'calculation-modifications';

  public async getEntitiesByPaymentId(paymentUid: string): Promise<CalculationModification[]> {
    return (await this.getEntities()).filter((entity) => entity.paymentUid === paymentUid)
  }

  public createFromJson(data: Record<string, any>): CalculationModification {
    const uid = this.extractValue(data, 'uid');
    const paymentUid = this.extractValue(data, 'paymentUid');
    const userUid = this.extractValue(data, 'userUid');
    const mathExpression = this.extractValue(data, 'mathExpression');

    if (mathExpression > 0) {
      return new PositiveCalculationModification(uid, paymentUid, userUid, mathExpression);
    }

    return new NegativeCalculationModification(uid, paymentUid, userUid, mathExpression);
  }
}
