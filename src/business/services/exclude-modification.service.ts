import { Injectable } from '@angular/core';
import ExcludeModification from '@business/models/modifications/exclude-modification';
import EntityService from '@business/core/entity-service';
import { CalculationModification } from '@business/services/calculation-modification.service';

@Injectable({
  providedIn: 'root',
})
export default class ExcludeModificationService extends EntityService<ExcludeModification> {
  protected _tableName: string = 'exclude-modifications';

  public async getEntitiesByPaymentId(paymentUid: string): Promise<ExcludeModification[]> {
    return (await this.getEntities()).filter((entity) => entity.paymentUid === paymentUid)
  }

  public async getEntitiesByPaymentAndUserId(paymentUid: string, userUid: string): Promise<ExcludeModification[]> {
    return (await this.getEntities()).filter((entity: ExcludeModification) => {
      return entity.paymentUid === paymentUid && entity.userUid === userUid;
    })
  }

  public createFromJson(data: Record<string, any>): ExcludeModification {
    const uid = this.extractValue(data, 'uid');
    const paymentUid = this.extractValue(data, 'paymentUid');
    const userUid = this.extractValue(data, 'userUid');

    return new ExcludeModification(uid, paymentUid, userUid);
  }
}
