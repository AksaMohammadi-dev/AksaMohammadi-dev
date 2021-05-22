import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientPurchaseOrderComponent } from './edit-client-purchase-order.component';

describe('EditClientPurchaseOrderComponent', () => {
  let component: EditClientPurchaseOrderComponent;
  let fixture: ComponentFixture<EditClientPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClientPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClientPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
