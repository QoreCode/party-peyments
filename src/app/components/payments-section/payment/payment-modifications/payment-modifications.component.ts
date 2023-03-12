import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import Payment from '@business/models/payment.model';
import User from '@business/models/user.model';
import {
  CreatePaymentModModalComponent
} from '@app/components/payments-section/create-payment-mod-modal/create-payment-mod-modal.component';
import { MatDialog } from '@angular/material/dialog';
import ExcludeModificationService from '@business/services/exclude-modification.service';
import ExcludeModification from '@business/models/modifications/exclude-modification';
import ApplicationStateService from '@business/services/application-state.service';
import EventService from '@business/services/event.service';
import { ToastrService } from 'ngx-toastr';
import UserService from '@business/services/user.service';
import { Subscription } from 'rxjs';
import { faCirclePlus, faClose } from '@fortawesome/free-solid-svg-icons';
import CalculationModificationService, { CalculationModification } from '@business/services/calculation-modification.service';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';

@Component({
  selector: 'app-payment-modifications',
  templateUrl: './payment-modifications.component.html',
  styleUrls: ['./payment-modifications.component.scss']
})
export class PaymentModificationsComponent implements OnDestroy, OnInit {
  @Input() payment!: Payment;

  public deleteIcon = faClose;
  public addIcon = faCirclePlus;

  public allUsers: User[] = [];
  public usersToSelect: User[] = [];

  public excludedModifications: ExcludeModification[] = [];
  public calculationModifications: CalculationModification[] = [];

  public eventServiceSubscription!: Subscription;
  public userServiceSubscription!: Subscription;
  public calcServiceSubscription!: Subscription;
  public execServiceSubscription!: Subscription;

  constructor(public dialog: MatDialog,
              public toastr: ToastrService,
              public applicationService: ApplicationStateService,
              public eventService: EventService,
              public userService: UserService,
              public excludeModificationService: ExcludeModificationService,
              public calculationModificationService: CalculationModificationService,
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

  // move it to some service
  public async setUsersToSelect() {
    const currentEventUid = this.applicationService.getSelectedEventUid();
    if (currentEventUid === undefined) {
      return;
    }

    const currentEvent = await this.eventService.getEntityByUid(currentEventUid);
    if (currentEvent === undefined) {
      this.toastr.error(`Selected event is undefined! Something went wrong!`);
      return;
    }

    const allUsersMap = new Map(this.allUsers.map((user: User) => [user.uid, user]));
    this.usersToSelect = currentEvent.involvedUserUids.reduce((users: User[], userUid: string) => {
      const user = allUsersMap.get(userUid);
      if (user !== undefined) {
        users.push(user);
      }

      return users;
    }, []);
  }

  public async removeExcludedModification(modificationUid: string): Promise<void> {
    try {
      const fbModDec = new FirebaseEntityServiceDecorator(this.excludeModificationService);
      await fbModDec.deleteEntity(modificationUid);

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
      const fbModDec = new FirebaseEntityServiceDecorator(this.calculationModificationService);
      await fbModDec.deleteEntity(modificationUid);

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
    const user = this.allUsers.find((user: User) => user.uid === modification.userUid);
    if (user !== undefined) {
      return user.name;
    }

    return modification.userUid;
  }

  public involvedUsersName(modification: CalculationModification): string {
    const allUsersSet = new Map(this.allUsers.map((user: User) => [user.uid, user]));
    const users = modification.usersUid.map((userUid: string) => {
      const user = allUsersSet.get(userUid);
      if (user === undefined) {
        this.toastr.error(`Can't find user with id ${ userUid }`);
        return userUid;
      }

      return user.name;
    });

    return users.join(', ');
  }

  public get isNoModifications(): boolean {
    return this.excludedModifications.length === 0 && this.calculationModifications.length === 0;
  }

  public openDialog(): void {
    this.dialog.open(CreatePaymentModModalComponent, {
      data: {
        payment: this.payment
      }
    });
  }

  public ngOnDestroy(): void {
    this.userServiceSubscription.unsubscribe();
    this.eventServiceSubscription.unsubscribe();
    this.execServiceSubscription.unsubscribe();
    this.calcServiceSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.userServiceSubscription = this.userService.subscribe((allUsers: Map<string, User>) => {
      this.allUsers = Array.from(allUsers.values());
    });

    this.eventServiceSubscription = this.eventService.subscribe(() => this.setUsersToSelect());

    this.execServiceSubscription = this.excludeModificationService.subscribe(async () => {
      this.excludedModifications = await this.excludeModificationService.getEntitiesByPaymentId(this.payment.uid);
    });

    this.calcServiceSubscription = this.calculationModificationService.subscribe(async () => {
      this.calculationModifications = await this.calculationModificationService.getEntitiesByPaymentId(this.payment.uid);
    });
  }
}
