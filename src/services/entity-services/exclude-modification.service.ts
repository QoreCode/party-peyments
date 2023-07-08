import EntityService from '@services/entity.service';
import UiStorageFactory from '@business/storages/factories/ui-storage.factory';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import { EntityNameList } from '@business/core/entity-list';
import { Injectable } from '@angular/core';
import ExcludeModification from '@business/modules/exclude-modification/exclude-modification.model';

@Injectable({
  providedIn: 'root',
})
export class ExcludeModificationService extends EntityService<ExcludeModification> {
  protected getEntityStorage(storageFactory: UiStorageFactory): IEntityStorage<ExcludeModification> {
    return storageFactory.getStorage(EntityNameList.excludeModification);
  }
}
