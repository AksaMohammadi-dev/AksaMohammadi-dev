import { Component, Output, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { VendorInvoiceService } from '../vendor-invoice-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { VendorInvoice } from '../vendor-invoice.model';
import { VendorInvoiceDetail } from '../vendor-invoice-detail.model';
import { VendorInvoiceProductDetail } from '../vendor-invoice-product-detail.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';

@Component({
  selector: 'app-vendor-invoice-create',
  templateUrl: './vendor-invoice-create.component.html',
  styleUrls: ['./vendor-invoice-create.component.css']
})
export class VendorInvoiceCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private vendorInvoiceId: string;
  isLoading = false;
  userId: string;
  form: FormGroup;
  vendorInvoice = {} as VendorInvoice;
  invoiceDetails: VendorInvoiceDetail[] = [];
  vendors: [];
  subLocations: [];
  locations: [];
  products: [];
  imagePreview: string;
  private authStatusSubs: Subscription;

  constructor(public vendorInvoiceService: VendorInvoiceService, 
    public authService: AuthService, 
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public httpClient: HttpClient,
    ) {

  }

  ngOnInit() {
    this.authStatusSubs = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.userId = this.authService.getUserId();
    this.form = new FormGroup({
      invoiceno: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      vendor: new FormControl(null, {
        validators: [Validators.required]
      }),
      totalamount: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
    
    this.vendorInvoiceService.getMetaData()
    .subscribe(metaDataRes => {
      
      this.vendors = metaDataRes.vendors;
      this.locations = metaDataRes.locs;
      this.subLocations = metaDataRes.subLocs;
      this.products = metaDataRes.products;
     
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('vendorInvoiceId')) {
          this.mode = 'edit';
          this.vendorInvoiceId = paramMap.get('vendorInvoiceId');
          this.isLoading = true;
          
            this.isLoading = false;
            this.vendorInvoiceService.getVendorInvoicesDetails(this.vendorInvoiceId)
            .subscribe(vendorInvoiceDetailData => {
  
                _.each(vendorInvoiceDetailData, (vendorInvoiceDetail) => {

                  let vendorInvoiceDetailInfo  = {} as VendorInvoiceDetail;
                  vendorInvoiceDetailInfo.id = vendorInvoiceDetail._id;
                  vendorInvoiceDetailInfo.quantity = vendorInvoiceDetail.quantity;
                  vendorInvoiceDetailInfo.product = vendorInvoiceDetail.product;
                  vendorInvoiceDetailInfo.vendorinvoice = vendorInvoiceDetail.vendorinvoice;
                  vendorInvoiceDetailInfo.stockId = vendorInvoiceDetail.stockId;
                  vendorInvoiceDetailInfo.vendorInvoiceProductDetail = [];

                  this.invoiceDetails.push(vendorInvoiceDetailInfo)
                })
            });
          
          
        }
        else {
          this.mode = 'create';
          this.vendorInvoiceId = null;
        }
      });

    });
    
  }

  onGetInvoiceProductDetails(invoiceData){

    this.vendorInvoiceService.getVendorInvoicesProductDetails(invoiceData.id)
      .subscribe(vendorInvoiceDetailData => {
        invoiceData.viewVendorInvoiceProductDetail = true;
        _.each(vendorInvoiceDetailData, (vendorInvoiceDetail) => {

          let vendorInvoiceProductDetail = {} as VendorInvoiceProductDetail;
          vendorInvoiceProductDetail.id = vendorInvoiceDetail._id;
          vendorInvoiceProductDetail.serialno = vendorInvoiceDetail.serialno;
          vendorInvoiceProductDetail.subLoc = vendorInvoiceDetail.subloc;
          vendorInvoiceProductDetail.loc = vendorInvoiceDetail.loc;
          vendorInvoiceProductDetail.vendorinvoicedetail = vendorInvoiceDetail.vendorinvoicedetail;
          vendorInvoiceProductDetail.stockId = vendorInvoiceDetail.stockId;
          
          invoiceData.vendorInvoiceProductDetail.push(vendorInvoiceProductDetail)
        })

        
        
        
      });
  }

  onAddInvoiceDetails(){
    // debugger;
    this.invoiceDetails.push({
      quantity: '0',
      id: '',
      product: '',
      vendorinvoice: this.vendorInvoiceId,
      stockId: '',
      vendorInvoiceProductDetail: []
    });
  }

  onAddInvoiceProductDetails(invoiceDetail){
    
    invoiceDetail.vendorInvoiceProductDetail.push({
      id: '',
      serialno: '',
      subLoc: '',
      loc: '',
      vendorinvoicedetail: invoiceDetail.id
    }) ;
  }

  onSaveInvoiceDetails(invoiceDetail){

    //save invoice details before adding invoice product details
    if(invoiceDetail.id == ''){
      this.vendorInvoiceService.addVendorInvoiceDetail(
        invoiceDetail.quantity,
        invoiceDetail.product,
        this.vendorInvoiceId,
        this.userId)
        .subscribe(response => {
          console.log(response);
          invoiceDetail.id = response.vendorInvoice.id
          invoiceDetail.stockId = response.vendorInvoice.stockId
        })
    }
  }

  onSaveInvoiceProductDetails(invoiceProductDetails, vendorInvoiceDetailId, stockId){
    if(invoiceProductDetails.id == ''){
      this.vendorInvoiceService.addVendorInvoiceProductDetail(
        invoiceProductDetails.serialno,
        invoiceProductDetails.subLoc,
        invoiceProductDetails.loc,
        vendorInvoiceDetailId,
        stockId,
        this.userId)
        .subscribe(response => {
          console.log(response);
          invoiceProductDetails.id = response.vendorInvoiceDetail.id
        })
    }
  }

  onDeleteVendorInvoiceDetails(row){
    this.vendorInvoiceService.deleteVendorInvoiceDetail(row.id)
        .subscribe(response => {
          let index = _.findIndex(this.invoiceDetails, function(o) { return o.id == row.id; });
          this.invoiceDetails.splice(index, 1);
        })
  }

  onDeleteVendorInvoiceProductDetails(data, invoiceData){
    let index = _.findIndex(invoiceData.vendorInvoiceProductDetail, function(o) { return o.id == data.id; });
      this.vendorInvoiceService.deleteVendorInvoiceProductDetails(data.id)
        .subscribe(response => {
          invoiceData.vendorInvoiceProductDetail.splice(index, 1);
        })
   
  }
  
 
  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }

  onSaveVendorInvoice() {
    
    console.log(this.vendorInvoice);
    console.log(this.invoiceDetails);
    // if (this.mode === 'create') {

    //   this.vendorInvoiceService.addVendorInvoice(
    //     this.form.value.number,
    //     this.form.value.description,
    //     this.form.value.cgst,
    //     this.form.value.sgst,
    //     this.form.value.creator,
    //     this.form.value.price);
    // }
    // else {

    //   this.vendorInvoiceService.updateVendorInvoice(
    //     this.vendorInvoiceId,
    //     this.form.value.number,
    //     this.form.value.description,
    //     this.form.value.cgst,
    //     this.form.value.sgst,
    //     this.form.value.creator,
    //     this.form.value.price);
    // }

  }

  // onImagePick(event: Event){
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({
  //     image: file
  //   });
  //   this.form.get('image').updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // }

}

