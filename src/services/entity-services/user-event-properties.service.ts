import { Injectable } from '@angular/core';
import EntityService from '@services/entity.service';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';
import UiStorageFactory from '@business/storages/factories/ui-storage.factory';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import { EntityNameList } from '@business/core/entity-list';

@Injectable({
  providedIn: 'root',
})
export class UserEventPropertiesService extends EntityService<UserEventProperties> {
  protected getEntityStorage(storageFactory: UiStorageFactory): IEntityStorage<UserEventProperties> {
    return storageFactory.getStorage(EntityNameList.userEventProperties);
  }

  public hasAttachedUsers(selectedEventUid: string): boolean {
    return this.entities.some((userEventProperty: UserEventProperties) => userEventProperty.eventUid === selectedEventUid);
  }
}
