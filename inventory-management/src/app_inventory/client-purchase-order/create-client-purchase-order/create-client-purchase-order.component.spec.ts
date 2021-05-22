import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientPurchaseOrderComponent } from './create-client-purchase-order.component';

describe('CreateClientPurchaseOrderComponent', () => {
  let component: CreateClientPurchaseOrderComponent;
  let fixture: ComponentFixture<CreateClientPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClientPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClientPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
