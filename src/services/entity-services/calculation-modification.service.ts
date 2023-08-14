import EntityService from '@services/entity.service';
import UiStorageFactory from '@business/storages/factories/ui-storage.factory';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import { EntityNameList } from '@business/core/entity-list';
import { Injectable } from '@angular/core';
import CalculationModification from '@business/modules/calculation-modification/models/calculation-modification.model';

@Injectable({
  providedIn: 'root',
})
export class CalculationModificationService extends EntityService<CalculationModification> {
  protected getEntityStorage(storageFactory: UiStorageFactory): IEntityStorage<CalculationModification> {
    return storageFactory.getStorage(EntityNameList.calculationModification);
  }
}
