import { Component, Input } from '@angular/core';
import Payment from '@business/modules/payment/payment.model';
import User from '@business/modules/user/user.model';
import {
  CreatePaymentModModalComponent
} from '@app/components/payments-section/create-payment-mod-modal/create-payment-mod-modal.component';
import { MatDialog } from '@angular/material/dialog';
import ExcludeModification from '@business/modules/exclude-modification/exclude-modification.model';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, map, Observable } from 'rxjs';
import { faCirclePlus, faClose } from '@fortawesome/free-solid-svg-icons';
import ApplicationStateService from '@services/application-state.service';
import { ExcludeModificationService } from '@services/entity-services/exclude-modification.service';
import { CalculationModificationService } from '@services/entity-services/calculation-modification.service';
import CalculationModification from '@business/modules/calculation-modification/models/calculation-modification.model';
import { UserEventPropertiesService } from '@services/entity-services/user-event-properties.service';
import PartyEvent from '@business/modules/party-event/party-event.model';
import ExcludeModificationController from '@business/modules/exclude-modification/exclude-modification.controller';
import CalculationModificationController from '@business/modules/calculation-modification/calculation-modification.controller';
import { UserService } from '@services/entity-services/user.service';
import { PartyEventService } from '@services/entity-services/party-event.service';

@Component({
  selector: 'app-payment-modifications',
  templateUrl: './payment-modifications.component.html',
  styleUrls: ['./payment-modifications.component.scss']
})
export class PaymentModificationsComponent {
  @Input() payment!: Payment;
  @Input() currentEvent!: PartyEvent;

  public deleteIcon = faClose;
  public addIcon = faCirclePlus;

  constructor(private excludeModificationController: ExcludeModificationController,
              private calcModificationController: CalculationModificationController,
              private applicationService: ApplicationStateService,
              private partyEventService: PartyEventService,
              private userService: UserService,
              private userEventPropService: UserEventPropertiesService,
              private excludeModificationService: ExcludeModificationService,
              private calculationModificationService: CalculationModificationService,
              private dialog: MatDialog,
              private toastr: ToastrService,
  ) {
  }

  public editModification(modification: CalculationModification): void {
    this.dialog.open(CreatePaymentModModalComponent, {
      data: {
        payment: this.payment,
        modification
      }
    });
  }

  public get usersToSelect(): Observable<User[]> {
    return combineLatest([
      this.userService.getAll(),
      this.userEventPropService.getByParam('eventUid', this.currentEvent?.uid)
    ]).pipe(
      map(([users, userEventProps]) => {
        const userEventSet = new Set(userEventProps.map((userEventProp) => userEventProp.userUid));
        return users.filter((user: User) => userEventSet.has(user.uid));
      })
    )
  }

  public get excludedModifications(): Observable<ExcludeModification[]> {
    return this.excludeModificationService.getByParam('paymentUid', this.payment.uid);
  }

  public get calculationModifications(): Observable<CalculationModification[]> {
    return this.calculationModificationService.getByParam('paymentUid', this.payment.uid);
  }

  public async removeExcludedModification(modificationUid: string): Promise<void> {
    try {
      await this.excludeModificationController.delete(modificationUid);

      this.toastr.success(`Exclude modification successfully deleted`);
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      } else {
        alert(e);
      }
    }
  }

  public async removeCalculationModification(modificationUid: string): Promise<void> {
    try {
      await this.calcModificationController.delete(modificationUid);

      this.toastr.success(`Calculation modification successfully deleted`);
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      } else {
        alert(e);
      }
    }
  }

  public involvedUserName(modification: ExcludeModification): string {
    const user = this.userService.entities.find((user: User) => user.uid === modification.userUid);
    if (user !== undefined) {
      return user.name;
    }

    return modification.userUid;
  }

  public involvedUsersName(modification: CalculationModification): string {
    const allUsersSet = new Map(this.userService.entities.map((user: User) => [user.uid, user]));
    const users = modification.usersUid.map((userUid: string) => {
      const user = allUsersSet.get(userUid);
      if (user === undefined) {
        this.toastr.error(`Can't find user with id 1 ${ userUid }`);
        return userUid;
      }

      return user.name;
    });

    return users.join(', ');
  }

  public get isNoModifications(): Observable<boolean> {
    return combineLatest([this.excludedModifications, this.calculationModifications]).pipe(
      map(([excludedModifications, calculationModifications]) => {
        return excludedModifications.length === 0 && calculationModifications.length === 0;
      })
    )
  }

  public openDialog(): void {
    this.dialog.open(CreatePaymentModModalComponent, {
      data: {
        payment: this.payment
      }
    });
  }
}
