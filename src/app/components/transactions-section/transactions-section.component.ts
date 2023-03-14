import { Component, OnDestroy, OnInit } from '@angular/core';
import ApplicationStateService from '@business/services/application-state.service';
import { ToastrService } from 'ngx-toastr';
import EventService from '@business/services/event.service';
import { Subscription } from 'rxjs';
import Payment from '@business/models/payment.model';
import PaymentService from '@business/services/payment.service';
import TransactionService from '@business/services/transaction.service';
import Transaction from '@business/models/transaction.model';
import User from '@business/models/user.model';
import CalculationModificationService from '@business/services/calculation-modification.service';
import ExcludeModificationService from '@business/services/exclude-modification.service';

@Component({
  selector: 'app-transactions-section',
  templateUrl: './transactions-section.component.html',
  styleUrls: ['./transactions-section.component.scss']
})
export class TransactionsSectionComponent implements OnDestroy, OnInit {
  public hasAttachedUsers: boolean = true;
  public selectedEventUid?: string;
  public payments: Payment[] = [];
  public transactions: Transaction[] = [];
  public transactionsMap: Map<User, Map<User, number>> = new Map();

  public involvedUsers: User[] = [];

  public debounceId: number = 0;

  public eventSubscription!: Subscription;
  public calculationSubscription!: Subscription;
  public excludeSubscription!: Subscription;
  public paymentSubscription!: Subscription;
  public applicationSubscription!: Subscription;

  constructor(public applicationStateService: ApplicationStateService,
              public paymentService: PaymentService,
              public transactionService: TransactionService,
              public calculationService: CalculationModificationService,
              public excludeService: ExcludeModificationService,
              public eventService: EventService,
              public toastr: ToastrService) {
  }

  public async setHasAttachedUsers(): Promise<void> {
    const selectedEventUid = this.applicationStateService.getSelectedEventUid();
    if (selectedEventUid === undefined) {
      return;
    }

    const selectedEvent = await this.eventService.getEntityByUid(selectedEventUid);
    if (selectedEvent === undefined) {
      this.toastr.error(`No selected event found. You are scaring me!`);
      return;
    }

    this.hasAttachedUsers = selectedEvent.usersEventProperties.length > 0;
  }

  public get hasSelectedEvent(): boolean {
    return Boolean(this.applicationStateService.getSelectedEventUid());
  }

  public get hasPayments(): boolean {
    return this.payments.length > 0;
  }

  public getTransactionsMap() {
    const resultMap = new Map<User, Map<User, number>>();

    this.transactions.forEach((transaction: Transaction) => {
      const fromMap = resultMap.get(transaction.from) ?? new Map();
      const toMoney = fromMap.get(transaction.to) ?? 0;

      fromMap.set(transaction.to, toMoney + transaction.money);
      resultMap.set(transaction.from, fromMap);
    });

    this.transactionsMap = resultMap;
  }

  public debouncedTransactionGeneration() {
    clearTimeout(this.debounceId);

    this.debounceId = setTimeout(async () => {
      if (this.selectedEventUid === undefined) {
        return;
      }

      this.transactions = await this.transactionService.createTransactions(this.selectedEventUid);
      const involvedUsers = new Set<User>();
      this.transactions.forEach((transaction: Transaction) => {
        involvedUsers.add(transaction.from);
      });

      this.involvedUsers = Array.from(involvedUsers.values());

      this.getTransactionsMap();
    }, 500);
  }

  public ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
    this.paymentSubscription.unsubscribe();
    this.applicationSubscription.unsubscribe();
    this.calculationSubscription.unsubscribe();
    this.excludeSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.eventSubscription = this.eventService.subscribe(() => {
      this.setHasAttachedUsers();
    });

    this.paymentSubscription = this.paymentService.subscribe(async () => {
      const selectedEventUid = this.applicationStateService.getSelectedEventUid();
      if (selectedEventUid === undefined) {
        return;
      }

      this.payments = await this.paymentService.getPaymentsByEventUid(selectedEventUid);

      this.debouncedTransactionGeneration();
    });

    this.excludeSubscription = this.excludeService.subscribe(() => {
      const selectedEventUid = this.applicationStateService.getSelectedEventUid();
      if (selectedEventUid === undefined) {
        return;
      }

      this.debouncedTransactionGeneration();
    });

    this.calculationSubscription = this.calculationService.subscribe(() => {
      const selectedEventUid = this.applicationStateService.getSelectedEventUid();
      if (selectedEventUid === undefined) {
        return;
      }

      this.debouncedTransactionGeneration();
    });

    this.applicationSubscription = this.applicationStateService.subscribe(async () => {
      const selectedEventUid = this.applicationStateService.getSelectedEventUid();
      if (selectedEventUid === undefined) {
        return;
      }

      this.selectedEventUid = selectedEventUid;

      this.setHasAttachedUsers();

      this.payments = await this.paymentService.getPaymentsByEventUid(selectedEventUid);

      this.debouncedTransactionGeneration();
    });
  }
}
