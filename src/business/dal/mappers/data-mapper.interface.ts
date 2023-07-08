import Model from '@business/core/entity-model';

export default interface IDataMapper<TEntity extends Model> {
  create(entity: TEntity): Promise<void>;

  update(entity: TEntity): Promise<void>;

  delete(entityUid: string): Promise<void>;

  getAll(): Promise<TEntity[]>;

  getById(entityUid: string): Promise<TEntity | undefined>;
}
