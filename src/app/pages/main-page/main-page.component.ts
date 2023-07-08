import { Component, OnDestroy, OnInit } from '@angular/core';
import ApplicationStateService, { ApplicationState } from '@services/application-state.service';
import { Subscription } from 'rxjs';
import PaymentController from '@business/modules/payment/payment.controller';
import UserEventPropertiesController from '@business/modules/user-event-properties/user-event-properties.controller';
import CalculationModificationController from '@business/modules/calculation-modification/calculation-modification.controller';
import ExcludeModificationController from '@business/modules/exclude-modification/exclude-modification.controller';
import UserController from '@business/modules/user/user.controller';
import PartyEventController from '@business/modules/party-event/party-event.controller';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnDestroy, OnInit {
  public appServiceSubscription?: Subscription;
  public isEntitiesLoaded: boolean = false;
  public isCurrentEventSet: boolean = false;

  constructor(
    private userController: UserController,
    private paymentController: PaymentController,
    private partyEventController: PartyEventController,
    private userEventPropertiesController: UserEventPropertiesController,
    private calcModController: CalculationModificationController,
    private excludeModController: ExcludeModificationController,
    private applicationStateService: ApplicationStateService
  ) {
  }

  public get isAppLoaded(){
    return this.isEntitiesLoaded;
  }

  ngOnDestroy(): void {
    this.appServiceSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.appServiceSubscription = this.applicationStateService.subscribe((applicationState: ApplicationState) => {
      if (applicationState.selectedPartyEventUid) {
        this.isCurrentEventSet = true;
      }
    });

    Promise.all([
      this.userController.loadAllEntities(),
      this.paymentController.loadAllEntities(),
      this.calcModController.loadAllEntities(),
      this.partyEventController.loadAllEntities(),
      this.excludeModController.loadAllEntities(),
      this.userEventPropertiesController.loadAllEntities(),
    ]).then(() => {
      this.isEntitiesLoaded = true;
    })
  }
}
