import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faChevronDown, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import User from '@business/modules/user/user.model';
import { FormControl } from '@angular/forms';
import Payment from '@business/modules/payment/payment.model';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';
import PartyEvent from '@business/modules/party-event/party-event.model';
import { ToastrService } from 'ngx-toastr';
import UserEventPropertiesController from '@business/modules/user-event-properties/user-event-properties.controller';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { UserService } from '@services/entity-services/user.service';
import { UserEventPropertiesService } from '@services/entity-services/user-event-properties.service';
import { PaymentService } from '@services/entity-services/payment.service';
import ApplicationStateService, { ApplicationState } from '@services/application-state.service';

@Component({
  selector: 'app-related-users',
  templateUrl: './related-users.component.html',
  styleUrls: ['./related-users.component.scss']
})
export class RelatedUsersComponent implements OnDestroy, OnInit {
  @Input() user!: User;
  @Input() currentEvent!: PartyEvent;

  public arrowIcon = faChevronDown;
  public infoIcon = faInfoCircle;

  public userEventPopsSub!: Subscription;

  public isOpened: boolean = false;
  public userIdsInputControl = new FormControl<string[]>([]);

  constructor(
    private userEventController: UserEventPropertiesController,
    private userEventService: UserEventPropertiesService,
    private applicationStateService: ApplicationStateService,
    private paymentService: PaymentService,
    private userService: UserService,
    private toastr: ToastrService) {
  }

  public ngOnInit(): void {
    this.userEventPopsSub = this.applicationStateService.subscribe((applicationState: ApplicationState) => {
      const userEventProps = this.userEventService.entities.filter((userEventProp: UserEventProperties) => {
        return userEventProp.eventUid === this.currentEvent.uid && userEventProp.userUid === this.user.uid;
      })

      if (userEventProps.length === 0) {
        this.toastr.error(`This user isn't belong to this event`);
      } else {
        this.userIdsInputControl.setValue(userEventProps[0].payedForUserUids);
      }
    });
  }

  public ngOnDestroy(): void {
    this.userEventPopsSub.unsubscribe();
  }

  public get isNobodyToSelect(): Observable<boolean> {
    return combineLatest([
      this.disabledUsers,
      this.usersToSelect
    ]).pipe(
      map(([disabledUsers, usersToSelect]) => disabledUsers.length === usersToSelect.length)
    );
  }

  public get isSomeonePayedForThisUser(): Observable<boolean> {
    return this.userEventService.getByFilter((userEventProp: UserEventProperties) => {
      return userEventProp.hasPayedUserUid(this.user.uid);
    }).pipe(
      map((userEventProps: UserEventProperties[]) => userEventProps.length !== 0)
    )
  }

  public get payedUserName(): Observable<string[]> {
    return combineLatest([
      this.userEventService.getByFilter((userEventProp: UserEventProperties) => {
        return userEventProp.hasPayedUserUid(this.user.uid);
      }),
      this.userService.getAll()
    ]).pipe(
      map(([userEventProps, users]) => {
        if (userEventProps.length === 0) {
          return [];
        }

        const usersMap: Map<string, User> = new Map(users.map((user: User) => [user.uid, user]));
        return userEventProps.map((userEventProp: UserEventProperties) => {
          const payedUser = usersMap.get(userEventProp.userUid);
          if (payedUser === undefined) {
            return 'Some user';
          }

          return payedUser.name;
        });
      })
    );
  }

  public get usersTitle(): Observable<string> {
    return combineLatest([
      this.userEventService.getByParam('userUid', this.user.uid),
      this.userService.getAll(),
      this.usersToSelect
    ]).pipe(
      map(([userEventProps, users, usersToSelect]) => {
        if (userEventProps.length === 0) {
          return '';
        }

        const usersMap: Map<string, User> = new Map(users.map((user: User) => [user.uid, user]));
        const payForUsersNames = userEventProps[0].payedForUserUids.reduce((acc: string[], userUid: string) => {
          const user = usersMap.get(userUid);
          if (user !== undefined) {
            acc.push(user.name);
          }

          return acc;
        }, []);

        if (payForUsersNames.length === 0) {
          return '';
        }

        if (payForUsersNames.length === usersToSelect.length) {
          return `You are gonna pay for all users in this event!`;
        }

        return `You are gonna pay for: ${ payForUsersNames.join(', ') }`;
      })
    );
  }

  public get usersToSelect(): Observable<User[]> {
    return combineLatest([
      this.userService.getAll(),
      this.userEventService.getByParam('eventUid', this.currentEvent.uid)
    ]).pipe(
      map(([users, userEventProperties]) => {
        const involvedUsersSet = new Set(userEventProperties.map((eventProperties: UserEventProperties) => eventProperties.userUid));
        return users.filter((user: User) => user.uid !== this.user?.uid && involvedUsersSet.has(user.uid));
      })
    );
  }

  public toggleRelatedUsers() {
    this.isOpened = !this.isOpened;
  }

  public async addRelatedUser() {
    try {
      const selectedUsersUids = this.userIdsInputControl.getRawValue() || [];
      await this.userEventController.setPayFor(this.currentEvent.uid, this.user.uid, selectedUsersUids);

      this.toastr.success(`Payed user was successfully added`);
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      }
    }
  }

  public getOptionDisableHelpTitle(userOptionUid: string): Observable<string> {
    return combineLatest([
      this.userEventService.getByParam('eventUid', this.currentEvent.uid),
      this.userService.getAll(),
      this.paymentService.getByParam('userUid', userOptionUid),
    ]).pipe(
      map(([userEventProps, users, payments]) => {
        for (const eventProperties of userEventProps) {
          const someonePayForCurrentUser = eventProperties.userUid === userOptionUid && eventProperties.hasPayedUserUid(this.user.uid);
          if (someonePayForCurrentUser) {
            return 'This user is already payed for you';
          }

          if (eventProperties.userUid === userOptionUid && eventProperties.payedForUserUids.length > 0) {
            const allUsersMap = new Map(users.map((user) => [user.uid, user.name]));
            const usersNames = eventProperties.payedForUserUids.map((payedForUserUid: string) => allUsersMap.get(payedForUserUid));
            if (usersNames.length > 0) {
              return `This user is already pay for ${ usersNames.join(', ') }`;
            } else {
              return 'This user is already pay for someone';
            }
          }

          const someonePayForOptionUser = eventProperties.hasPayedUserUid(userOptionUid);
          if (someonePayForOptionUser) {
            const user = users.find((user: User) => user.uid === eventProperties.userUid);
            if (user !== undefined) {
              return `${ user.name } already payed for this user`;
            } else {
              return 'Someone already payed for this user';
            }
          }
        }

        const relatedPayments = payments.filter((payment: Payment) => payment.userUid === userOptionUid);
        if (relatedPayments.length !== 0) {
          return `User already pay for: ${ relatedPayments.map((payment: Payment) => payment.name).join(', ') }`
        }

        return `Something went wrong. This user disabled by mistake`
      })
    );
  }

  public getOptionHelpTitle(optionUser: User): Observable<string> {
    return this.paymentService.getByParam('userUid', optionUser.uid).pipe(
      map((payments: Payment[]) => {
        if (payments.length !== 0) {
          return `User ${ this.user.name } will pay for payments: ${ payments.map((payment: Payment) => payment.name).join(', ') }`
        }

        return '';
      })
    );
  }

  public isDisabledOption(userOptionUid: string): Observable<boolean> {
    return this.disabledUsers.pipe(map((users: User[]) => users.some((user: User) => user.uid === userOptionUid)));
  }

  public get disabledUsers(): Observable<User[]> {
    return combineLatest([
      this.usersToSelect,
      this.userEventService.getByParam('eventUid', this.currentEvent.uid)
    ]).pipe(
      map(([users, userEventsProps]) => {
        return users.filter((user: User) => {
          for (const userEventProps of userEventsProps) {
            if (userEventProps.hasPayedUserUid(user.uid) && userEventProps.userUid == this.user.uid) {
              return false;
            }

            // disable users who are paid by someone already
            if (userEventProps.hasPayedUserUid(user.uid)) {
              return true;
            }

            // disable users who are pay for someone already
            if (userEventProps.userUid === user.uid && userEventProps.payedForUserUids.length > 0) {
              return true;
            }

            // disable user (only one possible) who pay for current user
            if (userEventProps.userUid === user.uid && userEventProps.hasPayedUserUid(this.user.uid)) {
              return true;
            }
          }

          return false;
        });
      })
    )
  }
}


// v1
// user
// {
//   data: [
//     { id: 1, name: 'bas0', products: [1, 2] },
//     { id: 2, name: 'bas1', products: [1, 4] },
//     { id: 3, name: 'bas2', products: [3, 5] }
//   ]
// }
// product
// {
//   data: [
//     { id: 1, name: 'bas1' },
//     { id: 2, name: 'bas2' },
//     { id: 3, name: 'bas3' }
//     { id: 4, name: 'bas4' },
//     { id: 5, name: 'bas5' },
//   ]
// }

// v2
// {
//   data: [
//     { id: 1, name: 'bas', products: [{id: 1, text: 'ss'}, {id: 7, text: 'ss'}, {id: 5, text: 'ss'}] },
//     { id: 2, name: 'bas1', products: [{id: 1, text: 'ss'}, {id: 2, text: 'ss'}, {id: 7, text: 'ss'}] },
//     { id: 3, name: 'bas2', products: [{id: 3, text: 'ss'}, {id: 5, text: 'ss'}, {id: 6, text: 'ss'}] }
//   ]
// }


// /user?endFilterPoint = ['user','cat']
// v3
// {
//   data: [
//     { id: 1, name: 'bas', products: [1, 7, 5] },
//     { id: 2, name: 'bas1', products: [1, 2, 7] },
//     { id: 3, name: 'bas2', products: [3, 5, 6] }
//   ],
//   related:{
//     products:[
//       {id: 1, text: 'ss'}, {id: 7, text: 'ss', category: [5, 9]},
//       {id: 5, text: 'ss'}, {id: 2, text: 'ss'},
//       {id: 3, text: 'ss'}, {id: 6, text: 'ss'}
//     ],
//      categories: [
//        {id: 5, text: 'ss'}, {id: 9, text: 'ss', users: []}
//      ]
//   }
// }

// user (id1) -> product | -> category -> color -> product
//                         -> widget -> product

// expand: [{ path: 'user.product', exclude: [2,5,6] }, { path: 'user.product.widget.product', exclude: [2,54,6] }]
