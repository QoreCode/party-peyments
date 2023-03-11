import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import Payment from '@business/models/payment.model';
import User from '@business/models/user.model';
import UserService from '@business/services/user.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import EventService from '@business/services/event.service';
import ApplicationStateService from '@business/services/application-state.service';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import PaymentService from '@business/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnDestroy, OnInit {
  @Input() payment!: Payment;

  public allUsers: User[] = [];
  public usersToSelect: User[] = [];

  public updateIcon = faArrowsRotate;

  public userIdSelectControl = new FormControl<string>('', [Validators.required]);
  public priceInputControl = new FormControl<number>(0, [Validators.required, Validators.min(1)]);
  public nameInputControl = new FormControl<string>('', [Validators.required, Validators.minLength(4)]);

  public eventServiceSubscription!: Subscription;
  public userServiceSubscription!: Subscription;

  constructor(public userService: UserService,
              public eventService: EventService,
              public paymentService: PaymentService,
              public applicationService: ApplicationStateService,
              public toastr: ToastrService) {
  }

  public async updatePayment() {
    if (!this.userIdSelectControl.valid) {
      this.toastr.error('User is required for payment entity');
      return;
    }

    if (!this.priceInputControl.valid) {
      this.toastr.error(`Price is required for payment entity. It's also should have 1 number or more`);
      return;
    }

    if (!this.nameInputControl.valid) {
      this.toastr.error(`Name is required for payment entity. It's also should have 4 letters or more`);
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
      return;
    }

    this.payment.name = name;
    this.payment.userUid = userUid;
    this.payment.money = price;

    try {
      const fbPaymentServiceDec = new FirebaseEntityServiceDecorator(this.paymentService);
      await fbPaymentServiceDec.addOrUpdateEntity(this.payment);

      this.toastr.success(`Payment successfully updated!`);
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      } else {
        alert(e);
      }
    }
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
    this.usersToSelect = currentEvent.involvedUserUids.reduce((users: User[], userUid: string) => {
      const user = allUsersMap.get(userUid);
      if (user !== undefined) {
        users.push(user);
      }

      return users;
    }, []);
  }

  ngOnDestroy(): void {
    this.userServiceSubscription.unsubscribe();
    this.eventServiceSubscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.userIdSelectControl.setValue(this.payment.userUid);
    this.priceInputControl.setValue(this.payment.money);
    this.nameInputControl.setValue(this.payment.name);

    this.userServiceSubscription = this.userService.subscribe((allUsers) => {
      this.allUsers = Array.from(allUsers.values());
    });

    this.eventServiceSubscription = this.eventService.subscribe(() => this.setUsersToSelect());
  }
}
