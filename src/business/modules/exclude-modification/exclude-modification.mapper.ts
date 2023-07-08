import EntityMapper from '@business/dal/mappers/entity.mapper';
import ExcludeModification from '@business/modules/exclude-modification/exclude-modification.model';

export default class ExcludeModificationMapper extends EntityMapper<ExcludeModification>{
  protected createModelFromJson(data: any): ExcludeModification {
    const uid = this.extractValue(data, 'uid');
    const paymentUid = this.extractValue(data, 'paymentUid');
    const userUid = this.extractValue(data, 'userUid');

    return new ExcludeModification(uid, paymentUid, userUid);
  }
}
