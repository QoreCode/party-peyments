import EntityMapper from '@business/dal/mappers/entity.mapper';
import Payment from '@business/modules/payment/payment.model';

export default class PaymentMapper extends EntityMapper<Payment>{
  protected createModelFromJson(data: any): Payment {
    const uid = this.extractValue(data, 'uid');
    const name = this.extractValue(data, 'name');
    const userUid = this.extractValue(data, 'userUid');
    const date = this.extractValue(data, 'date');
    const money = this.extractValue(data, 'money');
    const eventUid = this.extractValue(data, 'eventUid');

    return new Payment(uid, name, userUid, money, eventUid, date);
  }
}
