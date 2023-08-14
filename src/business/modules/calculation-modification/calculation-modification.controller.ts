import EntityController from '@business/core/entity.controller';
import { Injectable } from '@angular/core';
import { EntityNameList } from '@business/core/entity-list';
import CalculationModification from '@business/modules/calculation-modification/models/calculation-modification.model';
import PositiveCalculationModificationModel
  from '@business/modules/calculation-modification/models/positive-calculation-modification.model';
import NegativeCalculationModificationModel
  from '@business/modules/calculation-modification/models/negative-calculation-modification.model';
import IDataMapper from '@business/dal/mappers/data-mapper.interface';
import { IEntityStorage } from '@business/storages/entity-storage.interface';

@Injectable({
  providedIn: 'root',
})
export default class CalculationModificationController extends EntityController<CalculationModification> {
  public async create(paymentUid: string, usersUids: string[], mathExpression: number, comment?: string): Promise<void> {
    const calcModification = mathExpression > 0 ?
      PositiveCalculationModificationModel.create(paymentUid, usersUids, mathExpression, comment) :
      NegativeCalculationModificationModel.create(paymentUid, usersUids, mathExpression, comment);

    const mapper = this.mappersFactory.createCalculationModificationMapper();
    await mapper.create(calcModification);

    const storage = this.storageFactory.getStorage(EntityNameList.calculationModification);
    storage.set(calcModification);
  }

  protected getRelatedMapper(): IDataMapper<CalculationModification> {
    return this.mappersFactory.createCalculationModificationMapper();
  }

  protected getRelatedStorage(): IEntityStorage<CalculationModification> {
    return this.storageFactory.getStorage(EntityNameList.calculationModification);
  }
}
