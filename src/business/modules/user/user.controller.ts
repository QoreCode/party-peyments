import { Injectable } from '@angular/core';
import EntityController from '@business/core/entity.controller';
import User from '@business/modules/user/user.model';
import IDataMapper from '@business/dal/mappers/data-mapper.interface';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import { EntityNameList } from '@business/core/entity-list';
import UserEventPropertiesController from '@business/modules/user-event-properties/user-event-properties.controller';

@Injectable({
  providedIn: 'root',
})
export default class UserController extends EntityController<User> {

  public constructor(private userEventPropController: UserEventPropertiesController) {
    super();
  }

  public override async delete(entityUid: string): Promise<void> {
    const mapper = this.getRelatedMapper();
    await mapper.delete(entityUid);

    const storage = this.getRelatedStorage();
    const user = storage.getById(entityUid);
    if (user !== undefined) {
      user.isActive = false;
      storage.update(user);
    }
  }

  public async create(eventUid: string,name: string, card?: string): Promise<void> {
    const entity = User.create(name, true, card);

    const mapper = this.getRelatedMapper();
    await mapper.create(entity);

    const storage = this.getRelatedStorage();
    storage.set(entity);

    await this.userEventPropController.create(eventUid, entity.uid);
  }

  protected getRelatedMapper(): IDataMapper<User> {
    return this.mappersFactory.createUserMapper();
  }

  protected getRelatedStorage(): IEntityStorage<User> {
    return this.storageFactory.getStorage(EntityNameList.user);
  }
}
