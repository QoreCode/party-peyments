import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentModModalComponent } from './create-payment-mod-modal.component';

describe('CreatePaymentModModalComponent', () => {
  let component: CreatePaymentModModalComponent;
  let fixture: ComponentFixture<CreatePaymentModModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePaymentModModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePaymentModModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
