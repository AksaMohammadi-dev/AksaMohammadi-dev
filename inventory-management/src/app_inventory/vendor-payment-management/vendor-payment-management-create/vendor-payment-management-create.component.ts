import { Component, Output, OnInit, OnDestroy } from '@angular/core';
import { VendorPaymentManagementService } from '../vendor-payment-management-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { VendorPaymentManagement } from '../vendor-payment-management.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import * as _ from 'lodash';
import { MatSelectChange } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-vendor-payment-management-create',
  templateUrl: './vendor-payment-management-create.component.html',
  styleUrls: ['./vendor-payment-management-create.component.css']
})
export class VendorPaymentManagementCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private vendorPaymentManagementId: string;
  isLoading = false;
  vendors: [];
  vendorInvoices:  any[];
  vendorPurchaseOrders: any[];
  form: FormGroup;
  vendorPaymentManagement: VendorPaymentManagement;
  selectedPurchaseOrder: string;
  selectedVendor: string;
  paymentDate: string;
  selectedVendorInvoice: string;
  imagePreview: string;
  private authStatusSubs: Subscription;

  constructor(public vendorPaymentManagementService: VendorPaymentManagementService, public authService: AuthService, public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.authStatusSubs = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      amount: new FormControl(null, {
        validators: [Validators.required]
      }),
      modeofpayment: new FormControl(null, {
        validators: [Validators.required]
      }),
      paymentslipref: new FormControl(null, {
        validators: [Validators.required]
      }),
      remark: new FormControl(null, {
        validators: [Validators.required]
      }),
      paymentlocation: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    this.vendorPaymentManagementService.getVendorPurchaseMetaData()
    .subscribe(metaDataRes => {

      this.vendors = metaDataRes.vendors;
      this.vendorPurchaseOrders = [];
      this.vendorInvoices = [];

      _.map(metaDataRes.purchaseOrders, (po) =>{
        let vendorPO = {
          id: po._id,
          name: po.ponumber
        }
        this.vendorPurchaseOrders.push(vendorPO);
      });

      _.map(metaDataRes.vendorInvoices, (po) =>{
        let vendorInv = {
          id: po._id,
          name: po.invoiceno
        }
        this.vendorInvoices.push(vendorInv);
      });

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('vendorPaymentManagementId')) {
          this.mode = 'edit';
          this.vendorPaymentManagementId = paramMap.get('vendorPaymentManagementId');
          this.isLoading = true;
          this.vendorPaymentManagementService.getVendorPaymentManagement(this.vendorPaymentManagementId)
          .subscribe(vendorPaymentManagementData => {
            this.isLoading = false;

            this.selectedPurchaseOrder = vendorPaymentManagementData.ponumber;
            this.selectedVendorInvoice = vendorPaymentManagementData.invoicenumber;
            this.selectedVendor = vendorPaymentManagementData.vendor;

            this.vendorPaymentManagement = {
              id: vendorPaymentManagementData._id,
              ponumber: vendorPaymentManagementData.ponumber,
              invoicenumber: vendorPaymentManagementData.invoicenumber,
              vendor: vendorPaymentManagementData.vendor,
              amount: vendorPaymentManagementData.amount,
              modeofpayment: vendorPaymentManagementData.modeofpayment,
              paymentslipref: vendorPaymentManagementData.paymentslipref,
              paymentlocation: vendorPaymentManagementData.paymentlocation,
              creator: vendorPaymentManagementData.creator,
              createdDate: vendorPaymentManagementData.createdDate,
            };
            this.form.setValue({
              ponumber: this.vendorPaymentManagement.ponumber,
              invoicenumber: this.vendorPaymentManagement.invoicenumber,
              vendor: this.vendorPaymentManagement.vendor,
              amount: this.vendorPaymentManagement.amount,
              modeofpayment: this.vendorPaymentManagement.modeofpayment,
              paymentslipref: this.vendorPaymentManagement.paymentslipref,
              paymentlocation: this.vendorPaymentManagement.paymentlocation,
              creator: this.vendorPaymentManagement.creator,
              createdDate: vendorPaymentManagementData.createdDate,
            });
          });
        }
        else {
          this.mode = 'create';
          this.vendorPaymentManagementId = null;
        }
      });

    });
    
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }

  selectedPurchaseOrderValue(event: MatSelectChange) {
    this.selectedPurchaseOrder = event.value;
  }

  selectedVendorInvoiceValue(event: MatSelectChange) {
    this.selectedVendorInvoice = event.value;
  }

  selectedVendorValue(event: MatSelectChange) {
    this.selectedVendor = event.value;
  }

  onSaveVendorPaymentManagement() {
    if (this.form.invalid) {
      return;
    }

    console.log(this.form.value);
    console.log(this.selectedPurchaseOrder);
    console.log(this.selectedVendorInvoice);
    console.log(this.selectedVendor);
    console.log(this.paymentDate)

    this.isLoading = true;
    if (this.mode === 'create') {

      // this.vendorPaymentManagementService.addVendorPaymentManagement(
      //   this.form.value.ponumber,
      //   this.form.value.invoicenumber,
      //   this.form.value.vendor,
      //   this.form.value.amount,
      //   this.form.value.modeofpayment,
      //   this.form.value.paymentslipref,
      //   this.form.value.paymentlocation,
      //   this.form.value.creator);
    }
    else {

      // this.vendorPaymentManagementService.updateVendorPaymentManagement(
      //   this.vendorPaymentManagementId,
      //   this.form.value.ponumber,
      //   this.form.value.invoicenumber,
      //   this.form.value.vendor,
      //   this.form.value.amount,
      //   this.form.value.modeofpayment,
      //   this.form.value.paymentslipref,
      //   this.form.value.paymentlocation,
      //   this.form.value.creator);
    }


    this.form.reset();
  }

  addEvent(type: string, event: any) {
    console.log(`${type}: ${event.value}`);
    this.paymentDate = event.value;
  }
}
