import { Injectable } from '@angular/core';
import Payment from '@business/models/payment';
import EntityService from '@business/core/entity-service';

@Injectable({
  providedIn: 'root',
})
export default class PaymentService extends EntityService<Payment> {
  protected _tableName: string = 'payments';

  public createFromJson(data: Record<string, any>): Payment {
    const uid = this.extractValue(data, 'uid');
    const name = this.extractValue(data, 'name');
    const userUid = this.extractValue(data, 'userUid');
    const money = this.extractValue(data, 'money');
    const eventUid = this.extractValue(data, 'eventUid');

    return new Payment(uid, name, userUid, money, eventUid);
  }
}
