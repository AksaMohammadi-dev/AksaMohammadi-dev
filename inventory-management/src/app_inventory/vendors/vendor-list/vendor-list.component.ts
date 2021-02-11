import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Vendor } from '../vendor.model';
import { VendorService } from '../vendor-service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app_inventory/auth/auth.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})

export class VendorListComponent implements OnInit, OnDestroy {

  public vendors: Vendor[] = [];
  private vendorsSub: Subscription;
  totalVendors = 0;
  vendorsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
  userId: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  ngOnInit(){
    this.vendorsService.getVendors(this.vendorsPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.vendorsSub = this.vendorsService.getVendorUpdateListner()
    .subscribe((vendorData: {
      vendors: Vendor[], vendorCount: number
    }) => {
      this.isLoading = false;
      this.totalVendors = vendorData.vendorCount;
      this.vendors = vendorData.vendors;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(vendorId: string){
    this.vendorsService.deleteVendor(vendorId)
    .subscribe(
      () => {
        this.vendorsService.getVendors(this.vendorsPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(){
    this.vendorsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.vendorsPerPage = pageData.pageSize;
    this.vendorsService.getVendors(this.vendorsPerPage, this.currentPage);
  }

  constructor(public vendorsService: VendorService, private authService: AuthService){

  }
}
