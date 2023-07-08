import { EntityNameList } from '@business/core/entity-list';
import EntityStorage from '@business/storages/entity.storage';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import { EntityStorageMapping } from '@business/storages/entity-storage.mapping';
import ExcludeModificationStorage from '@business/modules/exclude-modification/exclude-modification.storage';
import PaymentStorage from '@business/modules/payment/payment.storage';
import PartyEventStorage from '@business/modules/party-event/party-event.storage';
import UserStorage from '@business/modules/user/user.storage';
import TransactionStorage from '@business/modules/transaction/transaction.storage';
import CalculationModificationStorage from '@business/modules/calculation-modification/calculation-modification.storage';
import UserEventPropertiesStorage from '@business/modules/user-event-properties/user-event-properties.storage';

export default abstract class CommonStorageFactory {
  protected static readonly storages: Map<EntityNameList, IEntityStorage<any>> = new Map();

  public abstract getStorage<
    TEntity extends EntityStorageMapping[TEntityList], TEntityList extends EntityNameList
  >(key: TEntityList): IEntityStorage<TEntity>;

  protected getStorageFromList<
    TEntity extends EntityStorageMapping[TEntityList], TEntityList extends EntityNameList
  >(key: TEntityList): IEntityStorage<TEntity> {
    if (!CommonStorageFactory.storages.has(key)) {
      switch (key) {
        case EntityNameList.calculationModification:
          CommonStorageFactory.storages.set(key, new CalculationModificationStorage());
          break;
        case EntityNameList.excludeModification:
          CommonStorageFactory.storages.set(key, new ExcludeModificationStorage());
          break;
        case EntityNameList.payment:
          CommonStorageFactory.storages.set(key, new PaymentStorage());
          break;
        case EntityNameList.partyEvent:
          CommonStorageFactory.storages.set(key, new PartyEventStorage());
          break;
        case EntityNameList.user:
          CommonStorageFactory.storages.set(key, new UserStorage());
          break;
        case EntityNameList.transaction:
          CommonStorageFactory.storages.set(key, new TransactionStorage());
          break;
        case EntityNameList.userEventProperties:
          CommonStorageFactory.storages.set(key, new UserEventPropertiesStorage());
          break;
        default:
          CommonStorageFactory.storages.set(key, new EntityStorage());
      }
    }

    const storage = CommonStorageFactory.storages.get(key);
    if (storage === undefined) {
      throw new Error(`Storage ${ key } isn't defined`);
    }

    return storage;
  }
}
