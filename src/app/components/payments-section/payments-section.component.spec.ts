import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsSectionComponent } from './payments-section.component';

describe('PaymentsSectionComponent', () => {
  let component: PaymentsSectionComponent;
  let fixture: ComponentFixture<PaymentsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
