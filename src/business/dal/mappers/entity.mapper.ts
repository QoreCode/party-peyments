import Model from '@business/core/entity-model';
import IDataMapper from '@business/dal/mappers/data-mapper.interface';
import IDataAdapter from '@business/dal/data-adapter.interface';

export default abstract class EntityMapper<TEntity extends Model> implements IDataMapper<TEntity> {
  protected adapter: IDataAdapter;

  constructor(adapter: IDataAdapter) {
    this.adapter = adapter;
  }

  public async create(entity: TEntity): Promise<void> {
    const data = entity.toJson();
    await this.adapter.create(data, entity.uid);
  }

  public async update(entity: TEntity): Promise<void> {
    const data = entity.toJson();
    await this.adapter.update(data, entity.uid);
  }

  public async delete(entityUid: string): Promise<void> {
    await this.adapter.delete(entityUid);
  }

  public async getAll(): Promise<TEntity[]> {
    const entitiesData = await this.adapter.getAll();
    return entitiesData.map((entityData: any) => this.createModelFromJson(entityData));
  }

  public async getById(entityUid: string): Promise<TEntity | undefined> {
    const entityData = await this.adapter.getAll();
    return this.createModelFromJson(entityData);
  }

  protected extractValue(data: Record<string, any>, fieldName: string): any {
    const fieldValue = data[fieldName];
    if (fieldValue === undefined) {
      throw new Error(`${ fieldName } is required for model`);
    }

    return fieldValue;
  }

  protected abstract createModelFromJson(data: any): TEntity;
}
