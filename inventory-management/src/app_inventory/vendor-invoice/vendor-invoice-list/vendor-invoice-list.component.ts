import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { VendorInvoice } from '../vendor-invoice.model';
import { VendorInvoiceService } from '../vendor-invoice-service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import { MatDialog } from '@angular/material';
import { SuccessMessageComponent } from 'src/app_inventory/success-message/success-message.component';
import * as _ from 'lodash';

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
  public result:any;
  public show = false;
  constructor(public vendorInvoicesService: VendorInvoiceService, private authService: AuthService, private dialog: MatDialog){
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
  public ven = false
  public del = false
  public tick = true
  onAddInvoiceDetails(){
    // debugger;
    this.ven = true
    this.del = true
    this.tick = false
    let vendorInvoice = {} as VendorInvoice;
    vendorInvoice.creator = '';
    vendorInvoice.id = '';
    vendorInvoice.invoiceno = '',
    vendorInvoice.vendor = '',
    vendorInvoice.totalamount = '';

    this.vendorInvoices.push(vendorInvoice);
  }

  onDeleteInvoice(row){
    this.ven = false
    this.del = false
    this.vendorInvoicesService.deleteVendorInvoice(row.id)
      .subscribe((response:any) => {
          if(response.status){
            let index = _.findIndex(this.vendorInvoices, function(o) { 
              return o.id == row.id; 
            });
            this.vendorInvoices.splice(index, 1);
             this.dialog.open(SuccessMessageComponent,  {data:{ message: "Vendor invoice is deleted successfully.!", delete: true}})
          }else{
            this.dialog.open(SuccessMessageComponent,  {data:{ message: response.message, delete: false}})
          }
      })

  }

  onSaveVendorInvoice(vendor){
    this.ven = false
    this.del = false
    if(vendor._id != ''){
      this.vendorInvoicesService.addVendorInvoice(
        vendor.invoiceno,
        vendor.vendor,
        vendor.totalamount,
        this.userId)
        .subscribe(response => {
          this.result  = response
          vendor.id = response.vendorInvoice.id
          if(this.result.status){
            this.show = true;
            this.dialog.open(SuccessMessageComponent,  {data:{ message: "Vendor invoice is successfully created.!" ,create:true}})
          }else{
            this.dialog.open(SuccessMessageComponent,  {data:{ message: "Vendor invoice is successfully created.!" ,create:false}})
          }
        })
    }
    
    
  }

  ngOnDestroy(){
    this.ven = false
    this.del = false
    this.vendorInvoicesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.ven = false
    this.del = false
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.vendorInvoicesPerPage = pageData.pageSize;
    this.vendorInvoicesService.getVendorInvoices(this.vendorInvoicesPerPage, this.currentPage);
  }


}
