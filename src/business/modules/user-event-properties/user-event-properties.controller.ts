import { Injectable } from '@angular/core';
import EntityController from '@business/core/entity.controller';
import { EntityNameList } from '@business/core/entity-list';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';
import IDataMapper from '@business/dal/mappers/data-mapper.interface';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import { map } from 'rxjs';
import { EntityStorageMapping } from '@business/storages/entity-storage.mapping';

@Injectable({
  providedIn: 'root',
})
export default class UserEventPropertiesController extends EntityController<UserEventProperties> {
  public async createEntities(eventUid: string, userUids: string[]): Promise<void> {
    const mapper = this.getRelatedMapper();

    const entities: UserEventProperties[] = [];
    for (const userUid of userUids) {
      const entity = UserEventProperties.create(userUid, eventUid);
      await mapper.create(entity);
      entities.push(entity);
    }

    const storage = this.getRelatedStorage();
    storage.setList(entities);
  }

  public async create(eventUid: string, userUid: string): Promise<void> {
    const mapper = this.getRelatedMapper();
    const entity = UserEventProperties.create(userUid, eventUid);
    await mapper.create(entity);

    const storage = this.getRelatedStorage();
    storage.set(entity);
  }

  public async createIfNotExist(eventUid: string, userUids: string[]): Promise<void> {
    const storage = this.getRelatedStorage();
    const userUidsSet = new Set(userUids);
    const userEventsProperties = storage.getByParams({ eventUid });
    for (const userEventProperties of userEventsProperties) {
      if (userUidsSet.has(userEventProperties.userUid)) {
        userUidsSet.delete(userEventProperties.userUid);
      }
    }

    const mapper = this.getRelatedMapper();
    for (const userUidToCreate of userUidsSet.values()) {
      const entity = UserEventProperties.create(userUidToCreate, eventUid);
      await mapper.create(entity);

      storage.set(entity);
    }
  }

  public async setPayFor(eventUid: string, userUid: string, payForUserUids: string[]): Promise<void> {
    const storage = this.getRelatedStorage();
    const entities = storage.getByParams({ eventUid, userUid });
    if (entities === undefined) {
      throw new Error(`This user isn't belong to this event`);
    }

    if (entities.length > 1) {
      throw new Error(`Something went wrong, pls reload the page`);
    }

    const entity = entities[0];
    entity.setUserUidForPayed(payForUserUids);

    const mapper = this.getRelatedMapper();
    await mapper.update(entity);

    storage.update(entity);
  }

  public async deleteByParams(params: Partial<UserEventProperties>): Promise<void> {
    const storage = this.storageFactory.getStorage(EntityNameList.userEventProperties);
    const userEventProps = storage.getByParams(params);
    if (userEventProps.length !== 1) {
      throw new Error('Relation is not found');
    }

    const userEventProp = userEventProps[0];

    const mapper = this.mappersFactory.createUserEventPropertiesMapper();
    await mapper.delete(userEventProp.uid);

    storage.delete(userEventProp.uid);
  }

  protected getRelatedMapper(): IDataMapper<UserEventProperties> {
    return this.mappersFactory.createUserEventPropertiesMapper();
  }

  protected getRelatedStorage(): IEntityStorage<UserEventProperties> {
    return this.storageFactory.getStorage(EntityNameList.userEventProperties);
  }
}
