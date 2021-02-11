import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { VendorInvoice } from '../vendor-invoice.model';
import { VendorInvoiceService } from '../vendor-invoice-service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app_inventory/auth/auth.service';

@Component({
  selector: 'app-vendor-invoice-list',
  templateUrl: './vendor-invoice-list.component.html',
  styleUrls: ['./vendor-invoice-list.component.css']
})

export class VendorInvoiceListComponent implements OnInit, OnDestroy {

  public vendorInvoices: VendorInvoice[] = [];
  private vendorInvoicesSub: Subscription;
  totalVendorInvoices = 0;
  vendorInvoicesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  vendors: [];
  isLoading = false;
  userId: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  constructor(public vendorInvoicesService: VendorInvoiceService, private authService: AuthService,){

  }

  ngOnInit(){

    this.vendorInvoicesService.getMetaData()
    .subscribe(metaDataRes => {
      this.vendors = metaDataRes.vendors;

      this.vendorInvoicesService.getVendorInvoices(this.vendorInvoicesPerPage, this.currentPage);
      this.isLoading = true;
      this.userId = this.authService.getUserId();
      this.vendorInvoicesSub = this.vendorInvoicesService.getVendorInvoiceUpdateListner()
      .subscribe((vendorInvoiceData: {
        vendorInvoices: VendorInvoice[], vendorInvoiceCount: number
      }) => {
        this.isLoading = false;
        this.totalVendorInvoices = vendorInvoiceData.vendorInvoiceCount;
        
        this.vendorInvoices = vendorInvoiceData.vendorInvoices;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    });
  }

  onAddInvoiceDetails(){
    debugger;
    let vendorInvoice = {} as VendorInvoice;
    vendorInvoice.creator = '';
    vendorInvoice.id = '';
    vendorInvoice.invoiceno = '',
    vendorInvoice.vendor = '',
    vendorInvoice.totalamount = '';

    this.vendorInvoices.push(vendorInvoice);
  }

  onDeleteInvoice(row){
    
    this.vendorInvoicesService.deleteVendorInvoice(row.id)
      .subscribe(response => {
        console.log(response);
      })

  }

  onSaveVendorInvoice(vendor){

    
    if(vendor._id != ''){
      this.vendorInvoicesService.addVendorInvoice(
        vendor.invoiceno,
        vendor.vendor,
        vendor.totalamount,
        this.userId)
        .subscribe(response => {
          console.log(response);
          vendor.id = response.vendorInvoice.id
        })
    }
    
    
  }

  ngOnDestroy(){
    this.vendorInvoicesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.vendorInvoicesPerPage = pageData.pageSize;
    this.vendorInvoicesService.getVendorInvoices(this.vendorInvoicesPerPage, this.currentPage);
  }


}
