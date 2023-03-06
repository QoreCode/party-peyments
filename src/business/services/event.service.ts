import PartyEvent from '@business/models/party-event.model';
import { Injectable } from '@angular/core';
import EntityService from '@business/core/entity-service';
import UserEventProperties from '@business/models/user-event-properties.model';

@Injectable({
  providedIn: 'root',
})
export default class EventService extends EntityService<PartyEvent> {
  protected _tableName: string = 'events';

  public createFromJson(data: Record<string, any>): PartyEvent {
    const uid = this.extractValue(data, 'uid');
    const date = this.extractValue(data, 'date');
    const name = this.extractValue(data, 'name');
    const usersEventPropertiesData = this.extractValue(data, 'usersEventProperties');

    const usersEventProperties = usersEventPropertiesData ?
      usersEventPropertiesData.map((userEventPropertiesData: any) => this.createUserEventProperty(userEventPropertiesData)) : [];

    return new PartyEvent(uid, date, name, usersEventProperties);
  }

  public createUserEventProperty(userEventPropertiesData: Record<string, any>): UserEventProperties {
    const uid = this.extractValue(userEventPropertiesData, 'uid');
    const userUid = this.extractValue(userEventPropertiesData, 'userUid');
    const payedForUserUids = userEventPropertiesData.payedForUserUids ?? [];

    return new UserEventProperties(uid, userUid, payedForUserUids);
  }
}
