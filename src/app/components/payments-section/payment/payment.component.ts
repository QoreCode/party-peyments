import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import Payment from '@business/models/payment.model';
import User from '@business/models/user.model';
import UserService from '@business/services/user.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import EventService from '@business/services/event.service';
import ApplicationStateService from '@business/services/application-state.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnDestroy, OnInit {
  @Input() payment!: Payment;

  public allUsers: User[] = [];
  public usersToSelect: User[] = [];

  public userIdsInputControl = new FormControl<string>('');
  public priceInputControl = new FormControl<number>(0);
  public nameInputControl = new FormControl<string>('');

  public eventServiceSubscription!: Subscription;
  public userServiceSubscription!: Subscription;

  constructor(public userService: UserService,
              public eventService: EventService,
              public applicationService: ApplicationStateService,
              public toastr: ToastrService) {
  }

  public changeUser() {
    // lol
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
    this.userIdsInputControl.setValue(this.payment.userUid);
    this.priceInputControl.setValue(this.payment.money);
    this.nameInputControl.setValue(this.payment.name);

    this.userServiceSubscription = this.userService.subscribe((allUsers) => {
      this.allUsers = Array.from(allUsers.values());
    });

    this.eventServiceSubscription = this.eventService.subscribe(() => this.setUsersToSelect());
  }
}
