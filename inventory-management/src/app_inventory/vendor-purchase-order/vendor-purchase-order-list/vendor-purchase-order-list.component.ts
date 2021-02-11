import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { VendorPurchaseOrder } from '../vendor-purchase-order.model';
import { VendorPurchaseOrderService } from '../vendor-purchase-order-service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app_inventory/auth/auth.service';

@Component({
  selector: 'app-vendor-purchase-order-list',
  templateUrl: './vendor-purchase-order-list.component.html',
  styleUrls: ['./vendor-purchase-order-list.component.css']
})

export class VendorPurchaseOrderListComponent implements OnInit, OnDestroy {

  public vendorPurchaseOrders: VendorPurchaseOrder[] = [];
  private vendorPurchaseOrdersSub: Subscription;
  totalVendorPurchaseOrders = 0;
  vendorPurchaseOrdersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
  userId: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  ngOnInit(){
    this.vendorPurchaseOrdersService.getVendorPurchaseOrders(this.vendorPurchaseOrdersPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.vendorPurchaseOrdersSub = this.vendorPurchaseOrdersService.getVendorPurchaseOrderUpdateListner()
    .subscribe((vendorPurchaseOrderData: {
      vendorPurchaseOrders: VendorPurchaseOrder[], vendorPurchaseOrderCount: number
    }) => {
      this.isLoading = false;
      this.totalVendorPurchaseOrders = vendorPurchaseOrderData.vendorPurchaseOrderCount;
      this.vendorPurchaseOrders = vendorPurchaseOrderData.vendorPurchaseOrders;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(vendorPurchaseOrderId: string){
    this.vendorPurchaseOrdersService.deleteVendorPurchaseOrder(vendorPurchaseOrderId)
    .subscribe(
      () => {
        this.vendorPurchaseOrdersService.getVendorPurchaseOrders(this.vendorPurchaseOrdersPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(){
    this.vendorPurchaseOrdersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.vendorPurchaseOrdersPerPage = pageData.pageSize;
    this.vendorPurchaseOrdersService.getVendorPurchaseOrders(this.vendorPurchaseOrdersPerPage, this.currentPage);
  }

  constructor(public vendorPurchaseOrdersService: VendorPurchaseOrderService, private authService: AuthService){

  }
}
