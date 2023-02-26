import PartyEvent from '@business/models/party-event';
import { Injectable } from '@angular/core';
import EntityService from '@business/core/entity-service';

@Injectable({
  providedIn: 'root',
})
export default class EventService extends EntityService<PartyEvent> {
  protected _tableName: string = 'events';

  public createFromJson(data: Record<string, any>): PartyEvent {
    const uid = this.extractValue(data, 'uid');
    const date = this.extractValue(data, 'date');
    const name = this.extractValue(data, 'name');
    const userIds = this.extractValue(data, 'userIds');

    return new PartyEvent(uid, date, name, userIds);
  }
}
