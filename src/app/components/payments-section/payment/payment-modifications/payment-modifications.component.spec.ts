import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModificationsComponent } from './payment-modifications.component';

describe('PaymentModificationsComponent', () => {
  let component: PaymentModificationsComponent;
  let fixture: ComponentFixture<PaymentModificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentModificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
