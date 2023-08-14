import { Injectable } from '@angular/core';
import EntityController from '@business/core/entity.controller';
import { EntityNameList } from '@business/core/entity-list';
import Payment from '@business/modules/payment/payment.model';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import IDataMapper from '@business/dal/mappers/data-mapper.interface';

@Injectable({
  providedIn: 'root',
})
export default class PaymentController extends EntityController<Payment> {
  public async create(name: string, userUid: string | null, money: number, eventUid: string): Promise<void> {
    const entity = Payment.create(name, userUid, money, eventUid);
    const mapper = this.mappersFactory.createPaymentMapper();
    await mapper.create(entity);

    const storage = this.storageFactory.getStorage(EntityNameList.payment);
    storage.set(entity);
  }

  protected getRelatedMapper(): IDataMapper<Payment> {
    return this.mappersFactory.createPaymentMapper();
  }

  protected getRelatedStorage(): IEntityStorage<Payment> {
    return this.storageFactory.getStorage(EntityNameList.payment);
  }
}
