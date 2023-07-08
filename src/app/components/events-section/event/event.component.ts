import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import PartyEvent from '@business/modules/party-event/party-event.model';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ApplicationStateService, { ApplicationState } from '../../../../services/application-state.service';
import { Subscription } from 'rxjs';
import PartyEventController from '@business/modules/party-event/party-event.controller';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnDestroy, OnInit {
  @Input() partyEvent!: PartyEvent;

  public closeIcon = faXmark;
  public selectedEventUid?: string;

  public applicationSubscription?: Subscription;

  constructor(private partyEventController: PartyEventController, private applicationStateService: ApplicationStateService) {
  }

  public removeEvent() {
    this.partyEventController.delete(this.partyEvent.uid);
  }

  public setSelectEvent() {
    this.applicationStateService.setSelectedPartyEventUid(this.partyEvent.uid);
  }

  public get isSelectedEvent(): boolean {
    return this.partyEvent.uid === this.selectedEventUid;
  }

  ngOnDestroy(): void {
    this.applicationSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.applicationSubscription = this.applicationStateService.subscribe((applicationState: ApplicationState) => {
      this.selectedEventUid = applicationState.selectedPartyEventUid;
    })
  }
}
