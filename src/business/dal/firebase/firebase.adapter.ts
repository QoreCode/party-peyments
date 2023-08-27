import IDataAdapter from '@business/dal/data-adapter.interface';
import Firebase from '@business/dal/firebase/firebase.connection';
import { onValue, ref, remove, set } from 'firebase/database';
import { EntityKey } from '@business/dal/adapters/entities.list';
import { firebaseEntitiesList } from '@business/dal/firebase/firebase-entities.list';

export default class FirebaseAdapter implements IDataAdapter {
  protected tableName: string;

  constructor(entityKey: EntityKey) {
    if (firebaseEntitiesList[entityKey] === undefined) {
      throw new Error(`This '${entityKey}' entity key doesn't exist in the firebase entities list`)
    }
    this.tableName = firebaseEntitiesList[entityKey];
  }

  public async create(
    entity: Record<string, any>,
    entityUid: string
  ): Promise<void> {
    const dbInstance = Firebase.getInstance().db;
    await set(ref(dbInstance, `${this.tableName}/${entityUid}`), entity);
  }

  public async update(
    entity: Record<string, any>,
    entityUid: string
  ): Promise<void> {
    const dbInstance = Firebase.getInstance().db;
    await set(ref(dbInstance, `${this.tableName}/${entityUid}`), entity);
  }

  public async delete(entityUid: string): Promise<void> {
    const dbInstance = Firebase.getInstance().db;
    await remove(ref(dbInstance, `${this.tableName}/${entityUid}`));
  }

  public async getAll(): Promise<any[]> {
    const dbInstance = Firebase.getInstance().db;
    const starCountRef = ref(dbInstance, `${this.tableName}`);

    return new Promise((resolve) => {
      onValue(starCountRef, (snapshot) => {
        const result =
          snapshot.val() === null ? [] : Object.values(snapshot.val());
        resolve(result);
      });
    });
  }

  public async getById(entityUid: string): Promise<any> {
    const dbInstance = Firebase.getInstance().db;
    const starCountRef = ref(dbInstance, `${this.tableName}/${entityUid}`);

    return new Promise((resolve) => {
      onValue(starCountRef, (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }
}
