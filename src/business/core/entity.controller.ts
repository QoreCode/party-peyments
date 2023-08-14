import BusinessStorageFactory from '@business/storages/factories/business-storage.factory';
import DataMappersFactory from '@business/dal/mappers/data-mappers.factory';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import Model from '@business/core/entity-model';
import IDataMapper from '@business/dal/mappers/data-mapper.interface';

export default abstract class EntityController<TEntity extends Model> {
  protected storageFactory: BusinessStorageFactory;
  protected mappersFactory: DataMappersFactory;

  constructor() {
    this.storageFactory = new BusinessStorageFactory();
    this.mappersFactory = new DataMappersFactory();
  }

  public async loadAllEntities(): Promise<void> {
    const mapper = this.getRelatedMapper();
    const entities = await mapper.getAll();

    const storage = this.getRelatedStorage();
    storage.setList(entities);
  }

  public async update(entity: TEntity): Promise<void> {
    const mapper = this.getRelatedMapper();
    await mapper.update(entity);

    const storage = this.getRelatedStorage();
    storage.update(entity);
  }

  public async delete(entityUid: string): Promise<void> {
    const mapper = this.getRelatedMapper();
    await mapper.delete(entityUid);

    const storage = this.getRelatedStorage();
    storage.delete(entityUid);
  }

  protected abstract getRelatedStorage(): IEntityStorage<TEntity>;

  protected abstract getRelatedMapper(): IDataMapper<TEntity>;
}
