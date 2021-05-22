import { TestBed } from '@angular/core/testing';

import { ClientPurchaseOrderServiceService } from './client-purchase-order-service.service';

describe('ClientPurchaseOrderServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientPurchaseOrderServiceService = TestBed.get(ClientPurchaseOrderServiceService);
    expect(service).toBeTruthy();
  });
});
