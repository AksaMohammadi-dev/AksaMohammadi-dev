import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientPurchaseOrderComponent } from './list-client-purchase-order.component';

describe('ListClientPurchaseOrderComponent', () => {
  let component: ListClientPurchaseOrderComponent;
  let fixture: ComponentFixture<ListClientPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListClientPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClientPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
