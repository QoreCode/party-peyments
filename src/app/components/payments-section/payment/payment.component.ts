import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import Payment from '@business/models/payment.model';
import User from '@business/models/user.model';
import UserService from '@business/services/user.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnDestroy, OnInit {
  @Input() payment!: Payment;

  public allUsers: User[] = [];

  public userServiceSubscription!: Subscription;

  constructor(public userService: UserService, public toastr: ToastrService) {
  }

  get getUserName(): string {
    const user = this.allUsers.find((user: User) => user.uid === this.payment.userUid);
    if (user === undefined) {
      this.toastr.error(`Can't find user. Something went wrong!`);
      return '';
    }

    return user.name;
  }

  ngOnDestroy(): void {
    this.userServiceSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userServiceSubscription = this.userService.subscribe((allUsers) => {
      this.allUsers = Array.from(allUsers.values());
    })
  }
}
