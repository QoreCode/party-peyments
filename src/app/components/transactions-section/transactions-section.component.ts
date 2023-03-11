import { Component, OnDestroy, OnInit } from '@angular/core';
import ApplicationStateService from '@business/services/application-state.service';
import { ToastrService } from 'ngx-toastr';
import EventService from '@business/services/event.service';
import { Subscription } from 'rxjs';
import Payment from '@business/models/payment.model';
import PaymentService from '@business/services/payment.service';

@Component({
  selector: 'app-transactions-section',
  templateUrl: './transactions-section.component.html',
  styleUrls: ['./transactions-section.component.scss']
})
export class TransactionsSectionComponent implements OnDestroy, OnInit {
  public hasAttachedUsers: boolean = true;
  public payments: Payment[] = [];

  public eventSubscription!: Subscription;
  public paymentSubscription!: Subscription;
  public applicationSubscription!: Subscription;

  constructor(public applicationStateService: ApplicationStateService,
              public paymentService: PaymentService,
              public eventService: EventService,
              public toastr: ToastrService) {
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

  public get hasSelectedEvent(): boolean {
    return Boolean(this.applicationStateService.getSelectedEventUid());
  }

  public get hasPayments(): boolean {
    return this.payments.length > 0;
  }

  public ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
    this.paymentSubscription.unsubscribe();
    this.applicationSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.eventSubscription = this.eventService.subscribe(() => {
      this.setHasAttachedUsers();
    });

    this.paymentSubscription = this.paymentService.subscribe(async () => {
      const selectedEventUid = this.applicationStateService.getSelectedEventUid();
      if (selectedEventUid === undefined) {
        return;
      }

      this.payments = (await this.paymentService.getPaymentsByEventUid(selectedEventUid))
        .sort((a, b) => b.date - a.date);
    });

    this.applicationSubscription = this.applicationStateService.subscribe(async () => {
      const selectedEventUid = this.applicationStateService.getSelectedEventUid();
      if (selectedEventUid === undefined) {
        return;
      }

      this.setHasAttachedUsers();

      this.payments = (await this.paymentService.getPaymentsByEventUid(selectedEventUid))
        .sort((a, b) => b.date - a.date);
    });
  }
}
