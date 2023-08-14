import { Component, Input, OnInit } from '@angular/core';
import Payment from '@business/modules/payment/payment.model';
import User from '@business/modules/user/user.model';
import { combineLatest, map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { faCircleInfo, faFloppyDisk, faTrash } from '@fortawesome/free-solid-svg-icons';
import PartyEvent from '@business/modules/party-event/party-event.model';
import { UserService } from '@services/entity-services/user.service';
import { PartyEventService } from '@services/entity-services/party-event.service';
import { UserEventPropertiesService } from '@services/entity-services/user-event-properties.service';
import PaymentController from '@business/modules/payment/payment.controller';
import ApplicationStateService from '@services/application-state.service';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() payment!: Payment;

  public saveIcon = faFloppyDisk;
  public deleteIcon = faTrash;
  public infoIcon = faCircleInfo;

  public currentEvent!: PartyEvent;

  public userIdSelectControl = new FormControl<string>('', [Validators.required]);
  public priceInputControl = new FormControl<number>(0, [Validators.required, Validators.min(0)]);
  public nameInputControl = new FormControl<string>('', [Validators.required, Validators.minLength(4)]);

  constructor(private paymentController: PaymentController,
              private userService: UserService,
              private partyEventService: PartyEventService,
              private userEventPropService: UserEventPropertiesService,
              private applicationStateService: ApplicationStateService,
              private toastr: ToastrService) {
  }

  public async deletePayment() {
    try {
      await this.paymentController.delete(this.payment.uid);

      this.toastr.success(`Payment successfully deleted!`);
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      } else {
        alert(e);
      }
    }
  }

  public hasSomeonePayForUser(userUid: string): Observable<boolean> {
    return this.userEventPropService.getByParam('eventUid', this.currentEvent.uid).pipe(
      map((userEventProps: UserEventProperties[]) => {
        return userEventProps.some((userEventProp: UserEventProperties) => userEventProp.hasPayedUserUid(userUid));
      })
    );
  }

  public getPayerUserTitle(userUid: string): Observable<string> {
    return combineLatest([
      this.userEventPropService.getByParam('eventUid', this.currentEvent.uid),
      this.userService.getAll()
    ]).pipe(
      map(([userEventProps, users]) => {
        const usersMap = new Map(users.map((user: User) => [user.uid, user]));
        const payerUserEventProps = userEventProps.find((userEventProp: UserEventProperties) => userEventProp.hasPayedUserUid(userUid));
        if (payerUserEventProps === undefined) {
          return 'Some user already pay for this user';
        }

        const payer = usersMap.get(payerUserEventProps.userUid);
        if (payer === undefined) {
          return 'Some user already pay for this user';
        }

        return `${ payer.name } already pay for this user`;
      })
    );
  }

  public async updatePayment() {
    if (this.isSaveDisable) {
      return;
    }

    if (!this.userIdSelectControl.valid) {
      this.userIdSelectControl.markAsTouched();
      return;
    }

    if (!this.priceInputControl.valid) {
      this.priceInputControl.markAsTouched();
      return;
    }

    if (!this.nameInputControl.valid) {
      this.nameInputControl.markAsTouched();
      return;
    }

    const userUid = this.userIdSelectControl.getRawValue();
    const price = this.priceInputControl.getRawValue();
    const name = this.nameInputControl.getRawValue();

    if (userUid === null || price === null || name === null) {
      this.toastr.error(`Value in payment card is corrupted`);
      return;
    }

    if (userUid === this.payment.userUid && price === this.payment.money && name === this.payment.name) {
      this.toastr.error(`Nothing is changed`);
      this.userIdSelectControl.markAsUntouched();
      this.priceInputControl.markAsUntouched();
      this.nameInputControl.markAsUntouched();
      return;
    }

    this.payment.name = name;
    this.payment.userUid = userUid;
    this.payment.money = price;

    try {
      await this.paymentController.update(this.payment);

      this.toastr.success(`Payment successfully updated!`);

      this.userIdSelectControl.markAsUntouched();
      this.priceInputControl.markAsUntouched();
      this.nameInputControl.markAsUntouched();
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      } else {
        alert(e);
      }
    }
  }

  public get isSaveDisable() {
    return !this.userIdSelectControl.touched && !this.priceInputControl.touched && !this.nameInputControl.touched;
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

  public async ngOnInit(): Promise<void> {
    this.userIdSelectControl.setValue(this.payment.userUid);
    this.priceInputControl.setValue(this.payment.money);
    this.nameInputControl.setValue(this.payment.name);

    const currentEventUid = this.applicationStateService.getSelectedPartyEventUid();
    if (currentEventUid === undefined) {
      return;
    }

    const currentEvent = await this.partyEventService.entities.find((partyEvent: PartyEvent) => partyEvent.uid === currentEventUid);
    if (currentEvent === undefined) {
      this.toastr.error(`Selected event is undefined! Something went wrong!`);
      return;
    }

    this.currentEvent = currentEvent;
  }
}
