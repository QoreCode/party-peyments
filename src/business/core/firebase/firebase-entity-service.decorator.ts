import Firebase from '@business/core/firebase/firebase.singleton';
import { onValue, ref, remove, set } from 'firebase/database';
import Model from '@business/core/model';
import EntityService from '@business/core/entity-service';
import IEntityService from '@business/core/entity-service.interface';

export default class FirebaseEntityServiceDecorator<TEntity extends Model> implements IEntityService<TEntity> {
  protected entityService: EntityService<TEntity>;

  public constructor(entityService: EntityService<TEntity>) {
    this.entityService = entityService;
  }

  public async addOrUpdateEntity(entity: TEntity): Promise<void> {
    // @ts-ignore
    if (isDB && entity.isNew !== undefined) entity.isNew = false;

    const dbInstance = Firebase.getInstance().db;
    await set(ref(dbInstance, `${ this.entityService.tableName }/${ entity.uid }`), entity.toJson());

    this.entityService.addOrUpdateEntity(entity, true);
  }

  // TODO: костыль. Глянуть как сохранять коллекции
  public async addOrUpdateEntities(entities: TEntity[]): Promise<void> {
    await Promise.all(entities.map((entity) => this.addOrUpdateEntity(entity)));
  }

  public async deleteEntity(uid: string): Promise<void> {
    const dbInstance = Firebase.getInstance().db;
    await remove(ref(dbInstance, `${ this.entityService.tableName }/${ uid }`));

    this.entityService.deleteEntity(uid);
  }

  public async getEntityByUid(uid: string): Promise<TEntity> {
    const dbInstance = Firebase.getInstance().db;
    const starCountRef = ref(dbInstance, `${ this.entityService.tableName }`);

    return new Promise((resolve) => {
      onValue(starCountRef, (snapshot) => {
        const entity = this.entityService.createFromJson(snapshot.val());
        this.entityService.addOrUpdateEntity(entity, true);

        resolve(entity);
      });
    });
  }

  public async getEntities(): Promise<TEntity[]> {
    const dbInstance = Firebase.getInstance().db;
    const starCountRef = ref(dbInstance, `${ this.entityService.tableName }`);

    return new Promise((resolve) => {
      onValue(starCountRef, (snapshot) => {
        if (snapshot.val() === null) {
          resolve([]);
          return;
        }

        const entities = Object.values(snapshot.val()).map((value: any) => this.entityService.createFromJson(value))
        this.entityService.addOrUpdateEntities(entities);

        resolve(entities);
      });
    });
  }
}
