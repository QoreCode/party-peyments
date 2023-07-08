import EntityMapper from '@business/dal/mappers/entity.mapper';
import PartyEvent from '@business/modules/party-event/party-event.model';

export default class PartyEventMapper extends EntityMapper<PartyEvent> {
  protected createModelFromJson(data: any): PartyEvent {
    const uid = this.extractValue(data, 'uid');
    const date = this.extractValue(data, 'date');
    const name = this.extractValue(data, 'name');

    return new PartyEvent(uid, date, name);
  }
}
