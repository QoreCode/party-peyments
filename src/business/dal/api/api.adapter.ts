import IDataAdapter from '@business/dal/data-adapter.interface';
import ApiConnection from '@business/dal/api/api.connection';
import { EntityKey } from '@business/dal/adapters/entities.list';
import { apiEntitiesList } from '@business/dal/api/api-entities.list';

export default class ApiAdapter implements IDataAdapter {
  protected tableName: string;

  constructor(entityKey: EntityKey) {
    if (apiEntitiesList[entityKey] === undefined) {
      throw new Error(`This '${entityKey}' entity key doesn't exist in the api entities list`)
    }
    this.tableName = apiEntitiesList[entityKey];
  }

  public async create(
    entity: Record<string, any>,
    entityUid: string
  ): Promise<void> {
    const dbInstance = ApiConnection.getInstance().db;
    await dbInstance.post(this.tableName, entity);
  }

  public async update(
    entity: Record<string, any>,
    entityUid: string
  ): Promise<void> {
    const dbInstance = ApiConnection.getInstance().db;
    await dbInstance.put(`${this.tableName}/${entityUid}`, entity);
  }

  public async delete(entityUid: string): Promise<void> {
    const dbInstance = ApiConnection.getInstance().db;
    await dbInstance.delete(`${this.tableName}/${entityUid}`);
  }

  public async getAll(): Promise<any[]> {
    const dbInstance = ApiConnection.getInstance().db;
    const { data } = await dbInstance.get(`${this.tableName}`);
    return data;
  }

  public async getById(entityUid: string): Promise<any> {
    const dbInstance = ApiConnection.getInstance().db;
    const { data } = await dbInstance.get(`${this.tableName}/${entityUid}`);
    return data;
  }
}
