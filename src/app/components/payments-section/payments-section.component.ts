import { Component, OnDestroy, OnInit } from '@angular/core';
import ApplicationStateService from '@business/services/application-state.service';
import EventService from '@business/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import Payment from '@business/models/payment.model';
import PaymentService from '@business/services/payment.service';
import ExcludeModificationService from '@business/services/exclude-modification.service';
import CalculationModificationService from '@business/services/calculation-modification.service';

@Component({
  selector: 'app-payments-section',
  templateUrl: './payments-section.component.html',
  styleUrls: ['./payments-section.component.scss']
})
export class PaymentsSectionComponent implements OnDestroy, OnInit {
  public hasAttachedUsers: boolean = true;
  public plusIcon = faCirclePlus;

  public payments: Payment[] = [];

  public eventSubscription!: Subscription;
  public paymentSubscription!: Subscription;
  public applicationSubscription!: Subscription;

  constructor(public applicationStateService: ApplicationStateService,
              public toastr: ToastrService,
              public excludeModificationService: ExcludeModificationService,
              public calculationModificationService: CalculationModificationService,
              public paymentService: PaymentService,
              public eventService: EventService) {

    const fbPaymentDec = new FirebaseEntityServiceDecorator(this.paymentService);
    fbPaymentDec.getEntities();

    const fbExcludeModDec = new FirebaseEntityServiceDecorator(this.excludeModificationService);
    fbExcludeModDec.getEntities();

    const fbCalcModDec = new FirebaseEntityServiceDecorator(this.calculationModificationService);
    fbCalcModDec.getEntities();
  }

  public get hasPayments(): boolean {
    return this.payments.length > 0;
  }

  public addPayment() {
    const selectedEventUid = this.applicationStateService.getSelectedEventUid();
    if (selectedEventUid === undefined) {
      this.toastr.error(`No selected event found. You are scaring me!`);
      return;
    }

    const payment = Payment.create('', '', 0, selectedEventUid);
    this.paymentService.addOrUpdateEntity(payment);

    this.toastr.success(`Payment was successfully added. Do not forget to save it!`);
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
    this.paymentSubscription.unsubscribe();
    this.applicationSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.eventSubscription = this.eventService.subscribe(() => {
      this.setHasAttachedUsers();
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

    this.paymentSubscription = this.paymentService.subscribe(async (payments: Map<string, Payment>) => {
      const selectedEventUid = this.applicationStateService.getSelectedEventUid();
      if (selectedEventUid === undefined) {
        return;
      }

      this.payments = (await this.paymentService.getPaymentsByEventUid(selectedEventUid))
        .sort((a, b) => b.date - a.date);
    });
  }
}
