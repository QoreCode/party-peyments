import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import Payment from '@business/models/payment.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import User from '@business/models/user.model';
import { Subscription } from 'rxjs';
import UserService from '@business/services/user.service';
import ApplicationStateService from '@business/services/application-state.service';
import EventService from '@business/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ExcludeModificationService from '@business/services/exclude-modification.service';
import ExcludeModification from '@business/models/modifications/exclude-modification';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import PositiveCalculationModification from '@business/models/modifications/positive-calculation-modification';
import NegativeCalculationModification from '@business/models/modifications/negative-calculation-modification';
import CalculationModificationService, { CalculationModification } from '@business/services/calculation-modification.service';

@Component({
  selector: 'app-create-payment-mod-modal',
  templateUrl: './create-payment-mod-modal.component.html',
  styleUrls: ['./create-payment-mod-modal.component.scss']
})
export class CreatePaymentModModalComponent implements OnDestroy, OnInit {
  public isCalculation: boolean = true;

  public infoIcon = faInfoCircle;

  public allUsers: User[] = [];
  public attachedUsers: User[] = [];
  public excludedUsersUids: string[] = [];
  public excludeModifications: ExcludeModification[] = [];

  public usersToExcludeSelectControl = new FormControl<string[]>([]);
  public usersToCalcSelectControl = new FormControl<string[]>([], [Validators.required]);
  public priceToCalcSelectControl = new FormControl<number>(0, [
    Validators.required,
    Validators.minLength(1),
  ]);
  public commentToCalcSelectControl = new FormControl<string | undefined>(undefined, [
    Validators.minLength(1),
    Validators.maxLength(80)
  ]);

  public userServiceSubscription!: Subscription;
  public excludeModSubscription!: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { payment: Payment, modification?: CalculationModification },
              public userService: UserService,
              public dialogRef: MatDialogRef<CreatePaymentModModalComponent>,
              public excludeModService: ExcludeModificationService,
              public calculationModService: CalculationModificationService,
              public applicationService: ApplicationStateService,
              public eventService: EventService,
              public toastr: ToastrService,
  ) {
    if (this.data.modification !== undefined) {
      this.usersToCalcSelectControl.setValue(this.data.modification.usersUid);
      this.priceToCalcSelectControl.setValue(this.data.modification.mathExpression);
      this.commentToCalcSelectControl.setValue(this.data.modification.comment);
    }
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }

  public get usersToCalcSelect(): User[] {
    return this.attachedUsers;
  }

  public get usersToExcludeSelect(): User[] {
    return this.attachedUsers;
  }

  public isDisabledUser(user: User): boolean {
    return this.excludedUsersUids.some((excludedUserUid: string) => excludedUserUid === user.uid);
  }

  public getOptionHelpTitle(user: User): string {
    return `User ${ user.name } is excluded from the payment`;
  }

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
    this.attachedUsers = currentEvent.involvedUserUids.reduce((users: User[], userUid: string) => {
      const user = allUsersMap.get(userUid);
      if (user !== undefined) {
        users.push(user);
      }

      return users;
    }, []);
  }

  public setIsCalculation(isCalculation: boolean): void {
    this.isCalculation = isCalculation;
  }

  public async saveCalcMod() {
    if (!this.usersToCalcSelectControl.valid) {
      this.usersToCalcSelectControl.markAsTouched();
      return;
    }

    if (!this.priceToCalcSelectControl.valid) {
      this.priceToCalcSelectControl.markAsTouched();
      return;
    }

    if (!this.commentToCalcSelectControl.valid) {
      this.commentToCalcSelectControl.markAsTouched();
      return;
    }

    const userUids = this.usersToCalcSelectControl.getRawValue();
    const calcAmount = this.priceToCalcSelectControl.getRawValue();
    if (userUids === null || calcAmount === null) {
      this.toastr.error(`The fields are empty, pls check the value`);
      return;
    }

    if (calcAmount === 0) {
      this.toastr.error(`Amount cannot be zero. It doesn't make any sense!`);
      return;
    }

    try {
      let calcModification;
      if (this.data.modification !== undefined) {
        calcModification = this.data.modification;
        calcModification.usersUid = userUids;
        calcModification.mathExpression = calcAmount;
      } else {
        calcModification = calcAmount > 0 ?
          PositiveCalculationModification.create(this.data.payment.uid, userUids, calcAmount) :
          NegativeCalculationModification.create(this.data.payment.uid, userUids, calcAmount);
      }

      const comment = this.commentToCalcSelectControl.getRawValue();
      if (comment !== null) {
        calcModification.comment = comment;
      }

      const calcFBDec = new FirebaseEntityServiceDecorator(this.calculationModService);
      await calcFBDec.addOrUpdateEntity(calcModification);

      this.toastr.success(`Calculation modifications was successfully added`);
      this.dialogRef.close();
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      } else {
        alert(e);
      }
    }
  }

  public async saveExcludedUsers(): Promise<void> {
    const userUidsToExclude = this.usersToExcludeSelectControl.getRawValue();
    if (userUidsToExclude === null) {
      this.toastr.error(`Something went wrong. Can't find data from this users dropdown`);
      return;
    }

    if (userUidsToExclude.length === this.attachedUsers.length) {
      this.toastr.error(`You cannot just exclude all users from payment`);
      return;
    }

    try {
      const excludeModServerFbDec = new FirebaseEntityServiceDecorator(this.excludeModService);
      const calculationModServerFbDec = new FirebaseEntityServiceDecorator(this.calculationModService);
      const excludedModificationsMap = new Map(this.excludeModifications.map((excludeModification: ExcludeModification) => {
        return [excludeModification.userUid, excludeModification];
      }));

      for (const attachedUser of this.attachedUsers) {
        const needToExcludeUser = userUidsToExclude.some((userUidToExclude: string) => attachedUser.uid === userUidToExclude);
        const excludeMod = this.excludedUsersUids.find((excludedUserUid: string) => excludedUserUid === attachedUser.uid);
        if (needToExcludeUser) {
          if (excludeMod !== undefined) continue;

          const calculationModifications = await this.calculationModService.getEntitiesByPaymentAndUserId(this.data.payment.uid, attachedUser.uid);
          for (const calculationModification of calculationModifications) {
            calculationModification.removeUser(attachedUser.uid);

            if (calculationModification.usersUid.length === 0) {
              await calculationModServerFbDec.deleteEntity(calculationModification.uid);
            } else {
              await calculationModServerFbDec.addOrUpdateEntity(calculationModification);
            }
          }

          const excludedModification = ExcludeModification.create(attachedUser.uid, this.data.payment.uid);
          await excludeModServerFbDec.addOrUpdateEntity(excludedModification);
        } else {
          if (excludeMod === undefined) continue;

          const excludedModification = excludedModificationsMap.get(attachedUser.uid);
          if (excludedModification === undefined) {
            this.toastr.error(`Can't exclude user ${ attachedUser.name } from this payment`);
          } else {
            await excludeModServerFbDec.deleteEntity(excludedModification.uid);
          }
        }
      }

      this.toastr.success(`Excluded modifications was successfully updated`);
      this.dialogRef.close();
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      } else {
        alert(e);
      }
    }
  }

  public ngOnDestroy(): void {
    this.userServiceSubscription.unsubscribe();
    this.excludeModSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.userServiceSubscription = this.userService.subscribe((allUsers) => {
      this.allUsers = Array.from(allUsers.values());
    });

    this.excludeModSubscription = this.excludeModService.subscribe(async () => {
      this.excludeModifications = await this.excludeModService.getEntitiesByPaymentId(this.data.payment.uid);
      this.excludedUsersUids = this.excludeModifications.map((excludeModification: ExcludeModification) => excludeModification.userUid);
      this.usersToExcludeSelectControl.setValue(this.excludedUsersUids);
    });

    this.setUsersToSelect();
  }
}
