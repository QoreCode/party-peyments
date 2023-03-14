import Model from '@business/core/model';

export default interface IEntityService<TEntity extends Model> {
  addOrUpdateEntity(entities: TEntity, isDB: boolean): void;
  addOrUpdateEntities(entities: TEntity[]): void;
  deleteEntity(entityUid: string): void;
  getEntities(): Promise<TEntity[]>;
  getEntityByUid(uid: string): Promise<TEntity | undefined>;
}
