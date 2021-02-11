import { Component, Output, OnInit, OnDestroy } from '@angular/core';
import { VendorPurchaseOrderService } from '../vendor-purchase-order-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { VendorPurchaseOrder } from '../vendor-purchase-order.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-vendor-purchase-order-create',
  templateUrl: './vendor-purchase-order-create.component.html',
  styleUrls: ['./vendor-purchase-order-create.component.css']
})
export class VendorPurchaseOrderCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private vendorPurchaseOrderId: string;
  isLoading = false;
  form: FormGroup;
  vendorPurchaseOrder: VendorPurchaseOrder;
  imagePreview: string;
  private authStatusSubs: Subscription;
  vendors: [];
  products: [];
  selectedProduct: string;
  selectedVendor: string;
  vendorPONumber: string;

  constructor(public vendorPurchaseOrderService: VendorPurchaseOrderService, public authService: AuthService, public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.authStatusSubs = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    
    this.form = new FormGroup({
      ponumber: new FormControl({ value: '', disabled: true }, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      quantity: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    this.vendorPurchaseOrderService.getMetaData()
    .subscribe(metaDataRes => {
      this.vendors = metaDataRes.vendors;
      this.products = metaDataRes.products;
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('vendorPurchaseOrderId')) {
          this.mode = 'edit';
          this.vendorPurchaseOrderId = paramMap.get('vendorPurchaseOrderId');
          this.isLoading = true;
          this.vendorPurchaseOrderService.getVendorPurchaseOrder(this.vendorPurchaseOrderId)
          .subscribe(vendorPurchaseOrderData => {
            console.log('nnnnn',vendorPurchaseOrderData)
            this.isLoading = false;
            this.vendorPONumber = vendorPurchaseOrderData.ponumber;
            //this.form.setValue({ponumber: this.vendorPONumber}); 
            this.selectedProduct = vendorPurchaseOrderData.product;
            this.selectedVendor = vendorPurchaseOrderData.vendor;

            this.vendorPurchaseOrder = {
              id: vendorPurchaseOrderData._id,
              ponumber: vendorPurchaseOrderData.ponumber,
              product: vendorPurchaseOrderData.product, 
              quantity: vendorPurchaseOrderData.quantity, 
              vendor: vendorPurchaseOrderData.vendor,
              creator: vendorPurchaseOrderData.creator,
            };
            this.form.setValue({
              ponumber: this.vendorPurchaseOrder.ponumber,
              //product: this.vendorPurchaseOrder.product,
              quantity: this.vendorPurchaseOrder.quantity,
              //vendor: this.vendorPurchaseOrder.vendor,
              creator: this.vendorPurchaseOrder.creator,
            });
          });
        }
        else {
          this.mode = 'create';
          this.vendorPurchaseOrderId = null;
          this.vendorPONumber = 'VAR' + ++metaDataRes.vendorPOCnt;
          this.form.setValue({ponumber: this.vendorPONumber, quantity: ""}); 
        }
      });

    });
    
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }

  selectedVendorValue(event: MatSelectChange) {
    this.selectedVendor = event.value;
  }

  selectedProductValue(event: MatSelectChange) {
    this.selectedProduct = event.value;
  }

  onSaveVendorPurchaseOrder() {
    if (this.form.invalid) {
      return;
    }
    //this.isLoading = true;
    console.log(this.form.value, this.vendorPONumber, this.selectedVendor, this.selectedProduct)
    if (this.mode === 'create') {

      this.vendorPurchaseOrderService.addVendorPurchaseOrder(
        this.vendorPONumber,
        this.selectedProduct,
        this.form.value.quantity,
        this.selectedVendor,
        this.form.value.creator);
    }
    else {

      this.vendorPurchaseOrderService.updateVendorPurchaseOrder(
        this.vendorPurchaseOrderId,
        this.vendorPONumber,
        this.selectedProduct,
        this.form.value.quantity,
        this.selectedVendor,
        this.form.value.creator);
    }


    this.form.reset();
  }


}
