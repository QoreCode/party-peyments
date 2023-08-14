import EntityController from '@business/core/entity.controller';
import { Injectable } from '@angular/core';
import { EntityNameList } from '@business/core/entity-list';
import PartyEvent from '@business/modules/party-event/party-event.model';
import UserEventPropertiesController from '@business/modules/user-event-properties/user-event-properties.controller';
import IDataMapper from '@business/dal/mappers/data-mapper.interface';
import { IEntityStorage } from '@business/storages/entity-storage.interface';

@Injectable({
  providedIn: 'root',
})
export default class PartyEventController extends EntityController<PartyEvent> {

  constructor(private userEventPropertiesController: UserEventPropertiesController) {
    super();
  }

  public async create(name: string, userUids: string[]): Promise<PartyEvent> {
    const partyEvent = PartyEvent.create(name);
    const partyEventMapper = this.mappersFactory.createPartyEventMapper();
    await partyEventMapper.create(partyEvent);

    await this.userEventPropertiesController.createEntities(partyEvent.uid, userUids);

    const partyEventStorage = this.storageFactory.getStorage(EntityNameList.partyEvent);
    partyEventStorage.set(partyEvent);

    return partyEvent;
  }

  protected getRelatedMapper(): IDataMapper<PartyEvent> {
    return this.mappersFactory.createPartyEventMapper();
  }

  protected getRelatedStorage(): IEntityStorage<PartyEvent> {
    return this.storageFactory.getStorage(EntityNameList.partyEvent);
  }
}
