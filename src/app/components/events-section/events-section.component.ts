import { Component, OnDestroy } from '@angular/core';
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
export class EventsSectionComponent implements OnDestroy {
  public eventsList: PartyEvent[] = [];
  public eventsSubscription: Subscription;
  public closeIcon = faPlus;

  constructor(private eventService: EventService, public dialog: MatDialog, private applicationStateService: ApplicationStateService) {
    this.eventsSubscription = eventService.subscribe((entities: Map<string, PartyEvent>) => {
      this.eventsList = Array.from(entities.values()).sort((event1: PartyEvent, event2: PartyEvent) => {
        return event2.date - event1.date;
      });

      applicationStateService.setSelectedEventUid(this.eventsList[0].uid);
    });


    const fbDec = new FirebaseEntityServiceDecorator(this.eventService);
    fbDec.getEntities();

    // fbDec.addOrUpdateEntities([
    //   new PartyEvent(`1`, (new Date()).getTime(), `event name 1`, [`1`]),
    //   new PartyEvent(`2`, (new Date()).getTime()-241211250, `event name 2`, [`2`]),
    //   new PartyEvent(`3`, (new Date()).getTime()-534342235, `event name 3`, [`3`]),
    // ]);
  }

  public ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }

  public openDialog(): void {
    this.dialog.open(CreateEventModalComponent);
  }
}
