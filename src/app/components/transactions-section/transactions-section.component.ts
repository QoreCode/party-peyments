import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import ApplicationStateService from '../../../services/application-state.service';
import { combineLatest, debounce, map, Observable, Subscription, tap, timer } from 'rxjs';
import Payment from '@business/modules/payment/payment.model';
import Transaction from '@business/modules/transaction/transaction.model';
import User from '@business/modules/user/user.model';
import { PaymentService } from '@services/entity-services/payment.service';
import { TransactionService } from '@services/entity-services/transaction.service';
import { CalculationModificationService } from '@services/entity-services/calculation-modification.service';
import { ExcludeModificationService } from '@services/entity-services/exclude-modification.service';
import { PartyEventService } from '@services/entity-services/party-event.service';
import { UserEventPropertiesService } from '@services/entity-services/user-event-properties.service';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';
import TransactionController from '@business/modules/transaction/transaction.controller';

@Component({
  selector: 'app-transactions-section',
  templateUrl: './transactions-section.component.html',
  styleUrls: ['./transactions-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsSectionComponent implements OnDestroy, OnInit {
  public selectedEventUid?: string;
  public transactionsMap: Map<User, Map<User, number>> = new Map();

  public involvedUsers: User[] = [];

  public applicationSubscription!: Subscription;
  public transactionSubscription!: Subscription;

  constructor(
    private applicationStateService: ApplicationStateService,
    private transactionController: TransactionController,
    private paymentService: PaymentService,
    private userEventPropsService: UserEventPropertiesService,
    private transactionService: TransactionService,
    private calculationService: CalculationModificationService,
    private excludeService: ExcludeModificationService,
    private partyEventService: PartyEventService
  ) {

    this.transactionSubscription = this.generateTransactions().subscribe();
  }

  public ngOnInit(): void {
    this.applicationSubscription = this.applicationStateService.subscribe(async () => {
      this.selectedEventUid = this.applicationStateService.getSelectedPartyEventUid();
      this.createTransactions();
    });

    this.createTransactions();
  }

  public get hasAttachedUsers(): Observable<boolean> {
    return this.userEventPropsService.getByParam('eventUid', this.selectedEventUid).pipe(
      map((userEventProps: UserEventProperties[]) => userEventProps.length > 0)
    );
  }

  public get hasSelectedEvent(): boolean {
    return Boolean(this.applicationStateService.getSelectedPartyEventUid());
  }

  public get hasPayments(): Observable<boolean> {
    return this.paymentService.getByParam('eventUid', this.selectedEventUid).pipe(
      tap(() => console.log(`hasPayments`)),
      map((payments: Payment[]) => payments.length > 0)
    );
  }

  public get transactions(): Observable<Transaction[]> {
    return this.transactionService.getAll().pipe(
      tap((transactions: Transaction[]) => {
        this.getTransactionsMap(transactions);
      })
    );
  }

  public generateTransactions(): Observable<any> {
    return combineLatest([
      this.paymentService.getByParam('eventUid', this.selectedEventUid),
      this.userEventPropsService.getByParam('eventUid', this.selectedEventUid),
      this.partyEventService.getByParam('uid', this.selectedEventUid),
      this.excludeService.getAll(),
      this.calculationService.getAll()
    ]).pipe(
      debounce(() => timer(200)),
      tap(() => {
        this.createTransactions();
      })
    );
  }

  public getTransactionsMap(transactions: Transaction[]) {
    const resultMap = new Map<User, Map<User, number>>();
    const involvedUsers = new Set<User>();

    transactions.forEach((transaction: Transaction) => {
      const fromMap = resultMap.get(transaction.from) ?? new Map();
      const toMoney = fromMap.get(transaction.to) ?? 0;

      fromMap.set(transaction.to, toMoney + transaction.money);
      resultMap.set(transaction.from, fromMap);

      involvedUsers.add(transaction.from);
    });

    this.involvedUsers = Array.from(involvedUsers.values());

    this.transactionsMap = resultMap;
  }

  public ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
    this.transactionSubscription.unsubscribe();
  }

  private createTransactions() {
    if (this.selectedEventUid !== undefined) {
      this.transactionController.createTransactions(this.selectedEventUid).catch(() => {
        // todo: catch this error
      });
    }
  }
}
