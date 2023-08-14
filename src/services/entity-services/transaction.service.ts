import EntityService from '@services/entity.service';
import UiStorageFactory from '@business/storages/factories/ui-storage.factory';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import { EntityNameList } from '@business/core/entity-list';
import { Injectable } from '@angular/core';
import Transaction from '@business/modules/transaction/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends EntityService<Transaction> {
  protected getEntityStorage(storageFactory: UiStorageFactory): IEntityStorage<Transaction> {
    return storageFactory.getStorage(EntityNameList.transaction);
  }
}
