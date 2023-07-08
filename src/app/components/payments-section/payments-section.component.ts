import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, Subscription, tap } from 'rxjs';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Payment from '@business/modules/payment/payment.model';
import PaymentController from '@business/modules/payment/payment.controller';
import CalculationModificationController from '@business/modules/calculation-modification/calculation-modification.controller';
import ExcludeModificationController from '@business/modules/exclude-modification/exclude-modification.controller';
import { PaymentService } from '@services/entity-services/payment.service';
import UserEventPropertiesController from '@business/modules/user-event-properties/user-event-properties.controller';
import { UserEventPropertiesService } from '@services/entity-services/user-event-properties.service';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';
import ApplicationStateService from '@services/application-state.service';

@Component({
  selector: 'app-payments-section',
  templateUrl: './payments-section.component.html',
  styleUrls: ['./payments-section.component.scss']
})
export class PaymentsSectionComponent implements OnDestroy, OnInit {
  public selectedPartyEvent?: string;
  public plusIcon = faCirclePlus;

  public applicationSubscription!: Subscription;

  constructor(private paymentController: PaymentController,
              private userEventPropertiesController: UserEventPropertiesController,
              private calcModController: CalculationModificationController,
              private excludeModController: ExcludeModificationController,
              private userEventPropertiesService: UserEventPropertiesService,
              private applicationStateService: ApplicationStateService,
              private paymentService: PaymentService,
              private toastr: ToastrService) {
  }

  public get payments(): Observable<Payment[]> {
    return this.paymentService.getByParam('eventUid', this.selectedPartyEvent).pipe(
      tap((payments: Payment[]) => {
        payments.sort((payment1: Payment, payment2: Payment) => payment2.date - payment1.date);
      })
    );
  }

  public get hasAttachedUsers(): Observable<boolean> {
    return this.userEventPropertiesService.getByParam('eventUid', this.selectedPartyEvent).pipe(
      map((userEventProperties: UserEventProperties[]) => userEventProperties.length !== 0)
    );
  }

  public async addPayment() {
    const selectedEventUid = this.applicationStateService.getSelectedPartyEventUid();
    if (selectedEventUid === undefined) {
      this.toastr.error(`No selected event found. You are scaring me!`);
      return;
    }

    await this.paymentController.create('', null, 0, selectedEventUid);
    this.toastr.success(`Payment was successfully added. Do not forget to save it`);
  }

  public get hasSelectedEvent(): boolean {
    return Boolean(this.applicationStateService.getSelectedPartyEventUid());
  }

  public ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.applicationSubscription = this.applicationStateService.subscribe(async () => {
      this.selectedPartyEvent = this.applicationStateService.getSelectedPartyEventUid();
    });
  }
}
