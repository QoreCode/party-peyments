import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import Payment from '@business/models/payment.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import User from '@business/models/user.model';
import { Subscription } from 'rxjs';
import UserService from '@business/services/user.service';
import ApplicationStateService from '@business/services/application-state.service';
import EventService from '@business/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-payment-mod-modal',
  templateUrl: './create-payment-mod-modal.component.html',
  styleUrls: ['./create-payment-mod-modal.component.scss']
})
export class CreatePaymentModModalComponent implements OnDestroy, OnInit {
  public isCalculation: boolean = true;

  public infoIcon = faInfoCircle;

  public allUsers: User[] = [];
  public usersToSelect: User[] = [];

  public usersToExcludeSelectControl = new FormControl<string[]>([], [Validators.required]);
  public usersToCalcSelectControl = new FormControl<string[]>([], [Validators.required]);
  public priceToCalcSelectControl = new FormControl<string[]>([], [Validators.required]);

  public userServiceSubscription!: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { payment: Payment },
              public userService: UserService,
              public applicationService: ApplicationStateService,
              public eventService: EventService,
              public toastr: ToastrService,
  ) {
  }

  public get usersToCalcSelect(): User[] {
    return this.usersToSelect;
  }

  public get usersToExcludeSelect(): User[] {
    return this.usersToSelect;
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

  public setIsCalculation(isCalculation: boolean): void {
    this.isCalculation = isCalculation;
  }

  ngOnDestroy(): void {
    this.userServiceSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userServiceSubscription = this.userService.subscribe((allUsers) => {
      this.allUsers = Array.from(allUsers.values());
    });

    this.setUsersToSelect();
  }
}
