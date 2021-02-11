import { VendorPurchaseOrder } from './vendor-purchase-order.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class VendorPurchaseOrderService{

  private vendorPurchaseOrders: VendorPurchaseOrder[] = [];
  private vendorPurchaseOrdersUpdate = new Subject<{vendorPurchaseOrders: VendorPurchaseOrder[], vendorPurchaseOrderCount: number}>();

  constructor(private http: HttpClient, private router: Router){

  }

  getVendorPurchaseOrders(vendorPurchaseOrdersPerPage: number, currentPage: number){
    const queryParams = `?pageSize=${vendorPurchaseOrdersPerPage}&page=${currentPage}`;
    this.http.get<{message: string, vendorPurchaseOrders: any, maxVendorPurchaseOrders: number}>(
      BACKEND_URL + '/vendor-purchase-order/vendor-purchase-orders' + queryParams
    )
    .pipe(map((vendorPurchaseOrderData) => {
      
      return {
          vendorPurchaseOrder: vendorPurchaseOrderData.vendorPurchaseOrders.map(vendorPurchaseOrder => {
          return {
            id: vendorPurchaseOrder._id,
            ponumber: vendorPurchaseOrder.ponumber,
            product: vendorPurchaseOrder.product,
            quantity: vendorPurchaseOrder.quantity,
            vendor: vendorPurchaseOrder.vendor,
            creator: vendorPurchaseOrder.creator
          };
        }),
        maxVendorPurchaseOrder: vendorPurchaseOrderData.maxVendorPurchaseOrders
      };
    }))
    .subscribe((transformedVendorPurchaseOrdersData) => {
      this.vendorPurchaseOrders = transformedVendorPurchaseOrdersData.vendorPurchaseOrder;

      this.vendorPurchaseOrdersUpdate.next({
        vendorPurchaseOrders: [...this.vendorPurchaseOrders],
        vendorPurchaseOrderCount: transformedVendorPurchaseOrdersData.maxVendorPurchaseOrder
      });
    });
  }

  getVendorPurchaseOrder(id: string) {
    return this.http.get<{
      _id: string,
      ponumber: string;
      product: string;
      quantity: string;
      vendor: string;
      creator: string;
    }>(BACKEND_URL + '/vendor-purchase-order/vendor-purchase-order-get/' + id);
  }


 
  deleteVendorPurchaseOrder(vendorPurchaseOrderId: string) {

    return this.http.delete(BACKEND_URL + '/vendor-purchase-order/delete-vendor-purchase-order/' + vendorPurchaseOrderId);

  }

  getVendorPurchaseOrderUpdateListner(){
    return this.vendorPurchaseOrdersUpdate.asObservable();
  }

  updateVendorPurchaseOrder(id: string,  ponumber: string, product: string, quantity: string, vendor: string, creator: string) {
    let vendorPurchaseOrderData: VendorPurchaseOrder | FormData;

    vendorPurchaseOrderData = {
        id: id,
        ponumber: ponumber,
        quantity: quantity,
        vendor: vendor,
        product: product,
        creator: null
      };

    this.http
    .put(BACKEND_URL + '/vendor-purchase-order/update-vendor-purchase-order/' + id, vendorPurchaseOrderData)
    .subscribe(response => {
      this.router.navigate(['/list-vendor-purchase-order']);
    });
  }

  addVendorPurchaseOrder(ponumber: string, product: string, quantity: string, vendor: string, creator: string){
    const vendorPurchaseOrderData = new FormData();
    vendorPurchaseOrderData.append('ponumber', ponumber);
    vendorPurchaseOrderData.append('product', product);
    vendorPurchaseOrderData.append('quantity', quantity);
    vendorPurchaseOrderData.append('vendor', vendor);
    vendorPurchaseOrderData.append('creator', creator);

    this.http
      .post<{ message: string, vendorPurchaseOrder: VendorPurchaseOrder }>(BACKEND_URL + '/vendor-purchase-order/save-vendor-purchase-order', vendorPurchaseOrderData)
      .subscribe(responseData => {
        this.router.navigate(['/list-vendor-purchase-order']);
      });
  }

  getMetaData() {
    return this.http.get<{vendors: [],  products: [], vendorPOCnt: number}>(BACKEND_URL + '/meta-data/get/');
  }

}
