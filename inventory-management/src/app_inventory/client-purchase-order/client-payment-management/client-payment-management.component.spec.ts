import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPaymentManagementComponent } from './client-payment-management.component';

describe('ClientPaymentManagementComponent', () => {
  let component: ClientPaymentManagementComponent;
  let fixture: ComponentFixture<ClientPaymentManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPaymentManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPaymentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
