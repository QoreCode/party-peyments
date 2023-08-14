import EntityMapper from '@business/dal/mappers/entity.mapper';
import CalculationModification from '@business/modules/calculation-modification/models/calculation-modification.model';
import PositiveCalculationModificationModel
  from '@business/modules/calculation-modification/models/positive-calculation-modification.model';
import NegativeCalculationModificationModel
  from '@business/modules/calculation-modification/models/negative-calculation-modification.model';

export default class CalculationModificationMapper extends EntityMapper<CalculationModification>{
  protected createModelFromJson(data: any): CalculationModification {
    const uid = this.extractValue(data, 'uid');
    const paymentUid = this.extractValue(data, 'paymentUid');
    const usersUid = this.extractValue(data, 'usersUid');
    const mathExpression = this.extractValue(data, 'mathExpression');
    const comment = data.comment;

    if (mathExpression > 0) {
      return new PositiveCalculationModificationModel(uid, paymentUid, usersUid, mathExpression, comment);
    }

    return new NegativeCalculationModificationModel(uid, paymentUid, usersUid, mathExpression, comment);
  }
}
