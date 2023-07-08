export default interface IDataAdapter {
  create(entity: Record<string, any>, entityUid: string): Promise<void>;

  update(entity: Record<string, any>, entityUid: string): Promise<void>;

  delete(entityUid: string): Promise<void>;

  getAll(): Promise<any[]>;

  getById(entityUid: string): Promise<any>;
}
