import { Component, OnDestroy, OnInit } from '@angular/core';
import ApplicationStateService from '@business/services/application-state.service';
import EventService from '@business/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-payments-section',
  templateUrl: './payments-section.component.html',
  styleUrls: ['./payments-section.component.scss']
})
export class PaymentsSectionComponent implements OnDestroy, OnInit {
  public hasAttachedUsers: boolean = true;
  public plusIcon = faCirclePlus;

  public eventSubscription!: Subscription;
  public applicationSubscription!: Subscription;

  constructor(public applicationStateService: ApplicationStateService,
              public toastr: ToastrService,
              public eventService: EventService) {
  }

  public get hasSelectedEvent(): boolean {
    return Boolean(this.applicationStateService.getSelectedEventUid());
  }

  public async setHasAttachedUsers(): Promise<void> {
    const selectedEventUid = this.applicationStateService.getSelectedEventUid();
    if (selectedEventUid === undefined) {
      return;
    }

    const selectedEvent = await this.eventService.getEntityByUid(selectedEventUid);
    if (selectedEvent === undefined) {
      this.toastr.error(`No selected event found. You are scaring me!`);
      return;
    }

    this.hasAttachedUsers = selectedEvent.usersEventProperties.length > 0;
  }

  public ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
    this.applicationSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.eventSubscription = this.eventService.subscribe(() => {
      this.setHasAttachedUsers();
    });

    this.applicationSubscription = this.applicationStateService.subscribe(() => {
      this.setHasAttachedUsers();
    })
  }
}
