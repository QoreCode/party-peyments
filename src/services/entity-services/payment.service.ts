import EntityService from '@services/entity.service';
import UiStorageFactory from '@business/storages/factories/ui-storage.factory';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import { EntityNameList } from '@business/core/entity-list';
import Payment from '@business/modules/payment/payment.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends EntityService<Payment> {
  protected getEntityStorage(storageFactory: UiStorageFactory): IEntityStorage<Payment> {
    return storageFactory.getStorage(EntityNameList.payment);
  }
}
