import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { VendorPaymentManagement } from '../vendor-payment-management.model';
import { VendorPaymentManagementService } from '../vendor-payment-management-service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app_inventory/auth/auth.service';

@Component({
  selector: 'app-vendor-payment-management-list',
  templateUrl: './vendor-payment-management-list.component.html',
  styleUrls: ['./vendor-payment-management-list.component.css']
})

export class VendorPaymentManagementListComponent implements OnInit, OnDestroy {

  public vendorPaymentManagements: VendorPaymentManagement[] = [];
  private vendorPaymentManagementsSub: Subscription;
  totalVendorPaymentManagements = 0;
  vendorPaymentManagementsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
  userId: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  ngOnInit(){
    this.vendorPaymentManagementsService.getVendorPaymentManagements(this.vendorPaymentManagementsPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.vendorPaymentManagementsSub = this.vendorPaymentManagementsService.getVendorPaymentManagementUpdateListner()
    .subscribe((vendorPaymentManagementData: {
      vendorPaymentManagements: VendorPaymentManagement[], vendorPaymentManagementCount: number
    }) => {
      this.isLoading = false;
      this.totalVendorPaymentManagements = vendorPaymentManagementData.vendorPaymentManagementCount;
      this.vendorPaymentManagements = vendorPaymentManagementData.vendorPaymentManagements;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(vendorPaymentManagementId: string){
    this.vendorPaymentManagementsService.deleteVendorPaymentManagement(vendorPaymentManagementId)
    .subscribe(
      () => {
        this.vendorPaymentManagementsService.getVendorPaymentManagements(this.vendorPaymentManagementsPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(){
    this.vendorPaymentManagementsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.vendorPaymentManagementsPerPage = pageData.pageSize;
    this.vendorPaymentManagementsService.getVendorPaymentManagements(this.vendorPaymentManagementsPerPage, this.currentPage);
  }

  constructor(public vendorPaymentManagementsService: VendorPaymentManagementService, private authService: AuthService){

  }
}
