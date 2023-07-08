import CommonStorageFactory from '@business/storages/factories/common-storage.factory';
import { EntityNameList } from '@business/core/entity-list';
import { EntityStorageMapping } from '@business/storages/entity-storage.mapping';
import { IEntityStorage } from '@business/storages/entity-storage.interface';

export default class BusinessStorageFactory extends CommonStorageFactory {
  public getStorage<
    TEntity extends EntityStorageMapping[TEntityList],
    TEntityList extends EntityNameList,
  >(key: TEntityList): IEntityStorage<TEntity> {
    return this.getStorageFromList(key);
  }
}
