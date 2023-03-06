import { Component, Input } from '@angular/core';
import PartyEvent from '@business/models/party-event.model';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import EventService from '@business/services/event.service';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import ApplicationStateService, { ApplicationState } from '@business/services/application-state.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @Input() partyEvent!: PartyEvent;

  public closeIcon = faXmark;
  public selectedEventUid?: string;

  constructor(private eventService: EventService, private applicationStateService: ApplicationStateService) {
    this.applicationStateService.subscribe((applicationState: ApplicationState) => {
      this.selectedEventUid = applicationState.selectedEventUid;
    })
  }

  public removeEvent() {
    const fbDec = new FirebaseEntityServiceDecorator(this.eventService);
    fbDec.deleteEntity(this.partyEvent.uid);

    if (this.selectedEventUid === this.partyEvent.uid) {
      this.applicationStateService.setSelectedEventUid(undefined);
    }
  }

  public setSelectEvent() {
    this.applicationStateService.setSelectedEventUid(this.partyEvent.uid);
  }

  public get isSelectedEvent(): boolean {
    return this.partyEvent.uid === this.selectedEventUid;
  }
}
