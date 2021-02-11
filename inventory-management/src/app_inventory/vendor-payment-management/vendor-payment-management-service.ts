import { VendorPaymentManagement } from './vendor-payment-management.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class VendorPaymentManagementService{

  private vendorPaymentManagements: VendorPaymentManagement[] = [];
  private vendorPaymentManagementsUpdate = new Subject<{vendorPaymentManagements: VendorPaymentManagement[], vendorPaymentManagementCount: number}>();

  constructor(private http: HttpClient, private router: Router){

  }

  getVendorPaymentManagements(vendorPaymentManagementsPerPage: number, currentPage: number){
    const queryParams = `?pageSize=${vendorPaymentManagementsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, vendorPaymentManagements: any, maxVendorPaymentManagements: number}>(
      BACKEND_URL + '/vendor-payment-management/vendor-payment-managements' + queryParams
    )
    .pipe(map((vendorPaymentManagementData) => {
      return {
          vendorPaymentManagement: vendorPaymentManagementData.vendorPaymentManagements.map(vendorPaymentManagement => {
          return {
            id: vendorPaymentManagement._id,
            ponumber: vendorPaymentManagement.ponumber,
            invoicenumber: vendorPaymentManagement.invoicenumber,
            vendor: vendorPaymentManagement.vendor,
            amount: vendorPaymentManagement.amount,
            modeofpayment: vendorPaymentManagement.modeofpayment,
            paymentslipref: vendorPaymentManagement.paymentslipref,
            paymentlocation: vendorPaymentManagement.paymentlocation,
            creator: vendorPaymentManagement.creator
          };
        }),
        maxVendorPaymentManagement: vendorPaymentManagementData.maxVendorPaymentManagements
      };
    }))
    .subscribe((transformedVendorPaymentManagementsData) => {
      this.vendorPaymentManagements = transformedVendorPaymentManagementsData.vendorPaymentManagement;

      this.vendorPaymentManagementsUpdate.next({
        vendorPaymentManagements: [...this.vendorPaymentManagements],
        vendorPaymentManagementCount: transformedVendorPaymentManagementsData.maxVendorPaymentManagement
      });
    });
  }

  getVendorPaymentManagement(id: string) {
    return this.http.get<{
      _id: string,
      ponumber: string,
      invoicenumber: string,
      vendor: string,
      amount: string,
      modeofpayment: string,
      paymentslipref: string,
      paymentlocation: string,
      creator: string,
      createdDate: string,
    }>(BACKEND_URL + '/vendor-payment-management/get-vendor-payment-management/' + id);
  }


 
  deleteVendorPaymentManagement(vendorPaymentManagementId: string) {

    return this.http.delete(BACKEND_URL + '/vendor-payment-management/delete-vendor-payment-management/' + vendorPaymentManagementId);

  }

  getVendorPaymentManagementUpdateListner(){
    return this.vendorPaymentManagementsUpdate.asObservable();
  }

  updateVendorPaymentManagement(id: string, ponumber: string, invoicenumber: string, vendor: string, amount: string, modeofpayment: string, 
    paymentslipref: string, paymentlocation: string, creator: string) {
    let vendorPaymentManagementData: VendorPaymentManagement | FormData;

    vendorPaymentManagementData = {
        id: id,
        ponumber: ponumber,
        invoicenumber: invoicenumber,
        vendor: vendor,
        amount: amount,
        modeofpayment: modeofpayment,
        paymentslipref: paymentslipref,
        paymentlocation: paymentlocation,
        creator: null,
        createdDate: null,
      };

    this.http
    .put(BACKEND_URL + '/vendor-payment-management/update-vendor-payment-management/' + id, vendorPaymentManagementData)
    .subscribe(response => {
      this.router.navigate(['/list-vendor-payment-management']);
    });
  }

  addVendorPaymentManagement(ponumber: string, invoicenumber: string, vendor: string, amount: string, modeofpayment: string, paymentslipref: string, paymentlocation: string, creator: string){
    const vendorPaymentManagementData = new FormData();
    vendorPaymentManagementData.append('ponumber', ponumber);
    vendorPaymentManagementData.append('invoicenumber', invoicenumber);
    vendorPaymentManagementData.append('vendor', vendor);
    vendorPaymentManagementData.append('amount', amount);
    vendorPaymentManagementData.append('modeofpayment', modeofpayment);
    vendorPaymentManagementData.append('paymentslipref', paymentslipref);
    vendorPaymentManagementData.append('paymentlocation', paymentlocation);
    vendorPaymentManagementData.append('creator', creator);

    this.http
      .post<{ message: string, vendorPaymentManagement: VendorPaymentManagement }>(BACKEND_URL + '/vendor-payment-management/save-vendor-payment-management', vendorPaymentManagementData)
      .subscribe(responseData => {
        this.router.navigate(['/list-vendor-payment-management']);
      });
  }

  getVendorPurchaseMetaData() {
    return this.http.get<{vendors: [],  purchaseOrders: [], vendorInvoices: []}>(BACKEND_URL + '/meta-data/get-vendor-payment/');
  }

}
