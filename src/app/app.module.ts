import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsersSectionComponent } from './components/users-section/users-section.component';
import { EventsSectionComponent } from './components/events-section/events-section.component';
import { PaymentsSectionComponent } from './components/payments-section/payments-section.component';
import { TransactionsSectionComponent } from './components/transactions-section/transactions-section.component';
import { EventComponent } from './components/events-section/event/event.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { CreateEventModalComponent } from './components/events-section/create-event-modal/create-event-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UserComponent } from './components/users-section/user/user.component';
import { MatCardModule } from '@angular/material/card';
import { CreateUserModalComponent } from './components/users-section/create-user-modal/create-user-modal.component';
import { PaymentComponent } from './components/payments-section/payment/payment.component';
import { CreatePaymentModModalComponent } from './components/payments-section/create-payment-mod-modal/create-payment-mod-modal.component';
import { PaymentModificationsComponent } from './components/payments-section/payment/payment-modifications/payment-modifications.component';
import { TransactionItemComponent } from './components/transactions-section/transaction-item/transaction-item.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainPageComponent,
    UsersSectionComponent,
    EventsSectionComponent,
    PaymentsSectionComponent,
    TransactionsSectionComponent,
    EventComponent,
    CreateEventModalComponent,
    UserComponent,
    CreateUserModalComponent,
    PaymentComponent,
    CreatePaymentModModalComponent,
    PaymentModificationsComponent,
    TransactionItemComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        FontAwesomeModule,
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger', // set defaults here
        }),
        MatOptionModule,
        MatSelectModule,
        MatCardModule,
        MatExpansionModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
