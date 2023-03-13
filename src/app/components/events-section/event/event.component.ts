import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import PartyEvent from '@business/models/party-event.model';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import EventService from '@business/services/event.service';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import ApplicationStateService, { ApplicationState } from '@business/services/application-state.service';
import { Subscription } from 'rxjs';
import PaymentService from '@business/services/payment.service';
import Payment from '@business/models/payment.model';
import CalculationModificationService, { CalculationModification } from '@business/services/calculation-modification.service';
import ExcludeModificationService from '@business/services/exclude-modification.service';
import ExcludeModification from '@business/models/modifications/exclude-modification';

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

  constructor(private eventService: EventService,
              private paymentService: PaymentService,
              private calculationService: CalculationModificationService,
              private excludeService: ExcludeModificationService,
              private applicationStateService: ApplicationStateService) {

  }

  // todo: optimize related entities
  public async removeEvent() {
    if (this.selectedEventUid === this.partyEvent.uid) {
      const events = (await this.eventService.getEntities()).sort((event1: PartyEvent, event2: PartyEvent) => {
        return event2.date - event1.date;
      });
      const anotherEvent = events.find((event) => event.uid !== this.partyEvent.uid);
      if (anotherEvent !== undefined) {
        this.applicationStateService.setSelectedEventUid(anotherEvent.uid);
      } else {
        this.applicationStateService.setSelectedEventUid(undefined);
      }
    }

    const fbDec = new FirebaseEntityServiceDecorator(this.eventService);
    await fbDec.deleteEntity(this.partyEvent.uid);

    const payments = await this.paymentService.getPaymentsByEventUid(this.partyEvent.uid);
    const fbPaymentsDec = new FirebaseEntityServiceDecorator(this.paymentService);
    await Promise.all(payments.map(async (payment: Payment) => {
      const calcMods = await this.calculationService.getEntitiesByPaymentId(payment.uid);
      await Promise.all(calcMods.map((calcMod: CalculationModification) => this.calculationService.deleteEntity(calcMod.uid)));

      const exclMods = await this.excludeService.getEntitiesByPaymentId(payment.uid);
      await Promise.all(exclMods.map((exclMod: ExcludeModification) => this.excludeService.deleteEntity(exclMod.uid)));

      await fbPaymentsDec.deleteEntity(payment.uid);
    }));
  }

  public setSelectEvent() {
    this.applicationStateService.setSelectedEventUid(this.partyEvent.uid);
  }

  public get isSelectedEvent(): boolean {
    return this.partyEvent.uid === this.selectedEventUid;
  }

  ngOnDestroy(): void {
    this.applicationSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.applicationSubscription = this.applicationStateService.subscribe((applicationState: ApplicationState) => {
      this.selectedEventUid = applicationState.selectedEventUid;
    })
  }
}
