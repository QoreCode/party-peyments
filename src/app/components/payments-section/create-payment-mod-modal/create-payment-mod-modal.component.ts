import { Component, Inject } from '@angular/core';
import Payment from '@business/modules/payment/payment.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import User from '@business/modules/user/user.model';
import { combineLatest, map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@services/entity-services/user.service';
import ApplicationStateService from '@services/application-state.service';
import { UserEventPropertiesService } from '@services/entity-services/user-event-properties.service';
import CalculationModificationController from '@business/modules/calculation-modification/calculation-modification.controller';
import ExcludeModificationController from '@business/modules/exclude-modification/exclude-modification.controller';
import CalculationModification from '@business/modules/calculation-modification/models/calculation-modification.model';

@Component({
  selector: 'app-create-payment-mod-modal',
  templateUrl: './create-payment-mod-modal.component.html',
  styleUrls: ['./create-payment-mod-modal.component.scss']
})
export class CreatePaymentModModalComponent {
  public isCalculation: boolean = true;

  public infoIcon = faInfoCircle;

  public excludedUsersUids: string[] = [];

  public numberOfUsersCanBeSelected: number = 0;

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: { payment: Payment, modification?: CalculationModification },
              private calculationModificationController: CalculationModificationController,
              private excludeModificationController: ExcludeModificationController,
              private userService: UserService,
              private userEventPropService: UserEventPropertiesService,
              private applicationStateService: ApplicationStateService,
              private dialogRef: MatDialogRef<CreatePaymentModModalComponent>,
              private toastr: ToastrService,
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

  public isDisabledUser(user: User): boolean {
    return this.excludedUsersUids.some((excludedUserUid: string) => excludedUserUid === user.uid);
  }

  public getOptionHelpTitle(user: User): string {
    return `User ${ user.name } is excluded from the payment`;
  }

  public get usersToSelect(): Observable<User[]> {
    return combineLatest([
      this.userService.getAll(),
      this.userEventPropService.getByParam('eventUid', this.applicationStateService.getSelectedPartyEventUid())
    ]).pipe(
      map(([users, userEventProps]) => {
        const userEventSet = new Set(userEventProps.map((userEventProp) => userEventProp.userUid));
        const usersToSelect = users.filter((user: User) => userEventSet.has(user.uid));
        this.numberOfUsersCanBeSelected = usersToSelect.length;

        return usersToSelect;
      })
    )
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
      const comment = this.commentToCalcSelectControl.getRawValue() ?? undefined;
      if (this.data.modification === undefined) {
        await this.calculationModificationController.create(this.data.payment.uid, userUids, calcAmount, comment);
      } else {
        const calcModification = this.data.modification;
        calcModification.usersUid = userUids;
        calcModification.mathExpression = calcAmount;
        calcModification.comment = comment;

        await this.calculationModificationController.update(calcModification);
      }

      this.toastr.success(`Calculation modifications was successfully updated`);
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

    if (userUidsToExclude.length === this.numberOfUsersCanBeSelected) {
      this.toastr.error(`You cannot just exclude all users from payment`);
      return;
    }

    try {
      await this.excludeModificationController.updateList(userUidsToExclude, this.data.payment.uid);

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
}
