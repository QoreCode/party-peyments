import IDataAdapter from '@business/dal/data-adapter.interface';
import Api from './api.connection';

export default class ApiAdapter implements IDataAdapter {
  constructor(protected tableName: string) {}

  public async create(
    entity: Record<string, any>,
    entityUid: string
  ): Promise<void> {
    const dbInstance = Api.getInstance().db;
    await dbInstance.post(this.tableName, entity);
  }

  public async update(
    entity: Record<string, any>,
    entityUid: string
  ): Promise<void> {
    const dbInstance = Api.getInstance().db;
    await dbInstance.put(`${this.tableName}/${entityUid}`, entity);
  }

  public async delete(entityUid: string): Promise<void> {
    const dbInstance = Api.getInstance().db;
    await dbInstance.delete(`${this.tableName}/${entityUid}`);
  }

  public async getAll(): Promise<any[]> {
    const dbInstance = Api.getInstance().db;
    const { data } = await dbInstance.get(`${this.tableName}`);
    return data;
  }

  public async getById(entityUid: string): Promise<any> {
    const dbInstance = Api.getInstance().db;
    const { data } = await dbInstance.get(`${this.tableName}/${entityUid}`);
    return data;
  }
}