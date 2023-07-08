import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PartyEventService } from '@services/entity-services/party-event.service';
import PartyEvent from '@business/modules/party-event/party-event.model';

export interface ApplicationState {
  selectedPartyEventUid?: string;
}

@Injectable({
  providedIn: 'root',
})
export default class ApplicationStateService {
  protected applicationState: BehaviorSubject<ApplicationState> = new BehaviorSubject({});

  constructor(private partyEventService: PartyEventService) {
    this.partyEventService.getAll().subscribe({
      next: (partyEvents: PartyEvent[]) => {
        if (partyEvents.length === 0) {
          return this.setSelectedPartyEventUid(undefined);
        }

        const selectedPartyEventUid = this.getSelectedPartyEventUid();
        if (selectedPartyEventUid === undefined) {
          return this.setSelectedPartyEventUid(partyEvents[0].uid);
        }

        const hasSelectedPartyEvent = partyEvents.some((partyEvent: PartyEvent) => partyEvent.uid === selectedPartyEventUid);
        if (!hasSelectedPartyEvent) {
          return this.setSelectedPartyEventUid(partyEvents[0].uid);
        }
      },
    });
  }

  public setSelectedPartyEventUid(selectedEventUid: string | undefined): void {
    this.applicationState.next({ selectedPartyEventUid: selectedEventUid });
  }

  public getSelectedPartyEventUid(): string | undefined {
    return this.applicationState.getValue().selectedPartyEventUid;
  }

  public subscribe(onChange: (entity: ApplicationState) => void): Subscription {
    return this.applicationState.subscribe({ next: onChange });
  }
}
