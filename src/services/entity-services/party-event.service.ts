import EntityService from '@services/entity.service';
import UiStorageFactory from '@business/storages/factories/ui-storage.factory';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import { EntityNameList } from '@business/core/entity-list';
import { Injectable } from '@angular/core';
import PartyEvent from '@business/modules/party-event/party-event.model';

@Injectable({
  providedIn: 'root',
})
export class PartyEventService extends EntityService<PartyEvent> {
  protected getEntityStorage(storageFactory: UiStorageFactory): IEntityStorage<PartyEvent> {
    return storageFactory.getStorage(EntityNameList.partyEvent);
  }
}
