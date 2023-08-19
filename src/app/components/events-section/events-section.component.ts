import { ChangeDetectionStrategy, Component } from '@angular/core';
import PartyEvent from '@business/modules/party-event/party-event.model';
import { Observable, tap } from 'rxjs';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { CreateEventModalComponent } from '@app/components/events-section/create-event-modal/create-event-modal.component';
import { PartyEventService } from '@services/entity-services/party-event.service';

@Component({
  selector: 'app-events-section',
  templateUrl: './events-section.component.html',
  styleUrls: ['./events-section.component.scss'],
})
export class EventsSectionComponent {
  public closeIcon = faPlus;

  constructor(private partyEventService: PartyEventService, private dialog: MatDialog) {
  }

  public openDialog(): void {
    this.dialog.open(CreateEventModalComponent);
  }

  public get partyEventsList(): Observable<PartyEvent[]> {
    return this.partyEventService.getAll().pipe(
      tap((eventsList: PartyEvent[]) => {
        eventsList.sort((event1: PartyEvent, event2: PartyEvent) => event2.date - event1.date);
      })
    );
  }
}
