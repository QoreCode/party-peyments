import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatetUsersComponent } from './related-users.component';

describe('RelatetUsersComponent', () => {
  let component: RelatetUsersComponent;
  let fixture: ComponentFixture<RelatetUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatetUsersComponent]
    });
    fixture = TestBed.createComponent(RelatetUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
