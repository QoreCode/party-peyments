import { Component, Input, OnInit } from '@angular/core';
import User from '@business/modules/user/user.model';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import PartyEvent from '@business/modules/party-event/party-event.model';
import Payment from '@business/modules/payment/payment.model';
import ExcludeModification from '@business/modules/exclude-modification/exclude-modification.model';
import { MatDialog } from '@angular/material/dialog';
import { EditUserModalComponent } from '@app/components/users-section/edit-user-modal/edit-user-modal.component';
import { PartyEventService } from '@services/entity-services/party-event.service';
import { PaymentService } from '@services/entity-services/payment.service';
import { CalculationModificationService } from '@services/entity-services/calculation-modification.service';
import { ExcludeModificationService } from '@services/entity-services/exclude-modification.service';
import UserController from '@business/modules/user/user.controller';
import CalculationModification from '@business/modules/calculation-modification/models/calculation-modification.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  @Input() user!: User;
  @Input() currentEvent!: PartyEvent;

  public closeIcon = faXmark;
  public editIcon = faPen;

  public allUsers: User[] = [];
  public deleteUserMessage: string = '';
  public deleteUserTimerId: number | null = null;

  constructor(private userController: UserController,
              private paymentService: PaymentService,
              private partyEventService: PartyEventService,
              private calculationService: CalculationModificationService,
              private excludeService: ExcludeModificationService,
              private toastr: ToastrService,
              private dialog: MatDialog,
  ) {
  }

  // TODO: change it in task PP-43
  public async generateDeleteUserTitle(): Promise<void> {
    if (this.deleteUserTimerId !== null) {
      clearTimeout(this.deleteUserTimerId);
    }

    this.deleteUserTimerId = setTimeout(async () => {
      const [payments, calculationModifications] = this.getRelatedEntities();
      let message = 'The user wont be removed, but will be excluded from this event and can be added later.';

      const allUsersMap = new Map(this.allUsers.map((user: User) => [user.uid, user]));

      const whoThisUserPayedFor = this.currentEvent.findWhoPayedForUser(this.user.uid);
      if (whoThisUserPayedFor !== undefined) {
        const username = allUsersMap.get(whoThisUserPayedFor)?.name ?? '';
        message += '<br><br>' + `User <strong>${ username }</strong> won't be payer for user <strong>${ this.user.name }</strong> anymore`;
      }

      const eventProperties = this.currentEvent.getUserEventPropertiesByUserUid(this.user.uid);
      if (eventProperties !== undefined && eventProperties.payedForUserUids.length > 0) {
        const payedForMessages: string = eventProperties.payedForUserUids.map((payedForUserUid: string) => {
          const payedForUser = allUsersMap.get(payedForUserUid);
          if (payedForUser === undefined) return '';

          return `<br>- <strong>${ payedForUser.name }</strong>`;
        }).join(', ');
        const username = allUsersMap.get(this.user.uid)?.name ?? '';
        message += '<br><br>' + `User <strong>${ username }</strong> won't be payer for users: ${ payedForMessages }`;
      }

      if (payments.length !== 0) {
        const paymentNames = payments.map((payment: Payment) => `<br>- <strong>${ payment.name }</strong>`).join('');
        message += '<br><br> The following payments will be removed:' + paymentNames;
      }

      if (calculationModifications.length !== 0) {
        const allPayments: Payment[] = this.paymentService.entities;
        const paymentsMap = new Map(allPayments.map((payment: Payment) => [payment.uid, payment]));
        const modMessages = calculationModifications.map((calcMod: CalculationModification) => {
          const payment = paymentsMap.get(calcMod.paymentUid);
          if (payment === undefined) {
            return '';
          }

          return `- <strong>${ calcMod.mathExpression } UAH</strong> for payment: <strong>${ payment.name }</strong>`;
        }).join('<br>');

        message += '<br><br>' + `This modifications will be removed or updated: <br>${ modMessages }`;
      }

      this.deleteUserMessage = message;
    }, 500) as any as number;
  }

  public async deleteUser(): Promise<void> {
    try {
      if (this.user === undefined) {
        throw new Error(`User is undefined. Something unbelievable is going on`);
      }

      await this.userController.delete(this.user.uid);
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      } else {
        console.error(e);
      }
    }
  }

  public getRelatedEntities(): [Payment[], CalculationModification[], ExcludeModification[]] {
    const payments: Payment[] = this.paymentService.entities.filter((payment: Payment) => {
      return payment.userUid === this.user.uid && payment.eventUid === this.currentEvent.uid;
    });

    const allPayments: Payment[] = this.paymentService.entities;
    const allCalculationMods = this.calculationService.entities;
    const allExcludeMods = this.excludeService.entities;

    const calculationModifications: CalculationModification[] = allPayments.map((payment: Payment) => {
      return allCalculationMods.filter((calculation: CalculationModification) => {
        return calculation.isUserInvolved(this.user.uid) && calculation.paymentUid === payment.uid;
      });
    }).flat();

    const excludeModifications: ExcludeModification[] = allPayments.map((payment: Payment) => {
      return allExcludeMods.filter((excludeMod: ExcludeModification) => {
        return excludeMod.paymentUid === payment.uid && excludeMod.userUid === this.user.uid;
      });
    }).flat();

    return [payments, calculationModifications, excludeModifications];
  }

  public openEditUserDialog(): void {
    this.dialog.open(EditUserModalComponent, { data: { user: this.user } });
  }
}
