import EntityMapper from '@business/dal/mappers/entity.mapper';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';

export default class UserEventPropertiesMapper extends EntityMapper<UserEventProperties> {
  protected createModelFromJson(data: any): UserEventProperties {
    const uid = this.extractValue(data, 'uid');
    const userUid = this.extractValue(data, 'userUid');
    const eventUid = this.extractValue(data, 'eventUid');
    const payedForUserUids = data.payedForUserUids ?? [];

    return new UserEventProperties(uid, userUid, eventUid, payedForUserUids);
  }
}
