import { Component, OnDestroy, OnInit } from '@angular/core';
import EventService from '@business/services/event.service';
import PartyEvent from '@business/models/party-event.model';
import { Subscription } from 'rxjs';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { CreateEventModalComponent } from '@app/components/events-section/create-event-modal/create-event-modal.component';
import ApplicationStateService from '@business/services/application-state.service';

@Component({
  selector: 'app-events-section',
  templateUrl: './events-section.component.html',
  styleUrls: ['./events-section.component.scss']
})
export class EventsSectionComponent implements OnDestroy, OnInit {
  public eventsList: PartyEvent[] = [];
  public eventsSubscription!: Subscription;
  public closeIcon = faPlus;

  constructor(private eventService: EventService, public dialog: MatDialog, private applicationStateService: ApplicationStateService) {
    const fbDec = new FirebaseEntityServiceDecorator(this.eventService);
    fbDec.getEntities();
  }

  public ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }

  public openDialog(): void {
    this.dialog.open(CreateEventModalComponent);
  }

  public ngOnInit(): void {
    this.eventsSubscription = this.eventService.subscribe((entities: Map<string, PartyEvent>) => {
      this.eventsList = Array.from(entities.values()).sort((event1: PartyEvent, event2: PartyEvent) => {
        return event2.date - event1.date;
      });

      if (this.eventsList.length !== 0 && this.applicationStateService.getSelectedEventUid() === undefined) {
        this.applicationStateService.setSelectedEventUid(this.eventsList[0].uid);
      }
    });
  }
}
