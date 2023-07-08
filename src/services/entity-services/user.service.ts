import EntityService from '@services/entity.service';
import User from '@business/modules/user/user.model';
import UiStorageFactory from '@business/storages/factories/ui-storage.factory';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import { EntityNameList } from '@business/core/entity-list';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService extends EntityService<User> {
  protected getEntityStorage(storageFactory: UiStorageFactory): IEntityStorage<User> {
    return storageFactory.getStorage(EntityNameList.user);
  }
}
