import { VendorInvoice } from './vendor-invoice.model';
import { VendorInvoiceDetail } from './vendor-invoice-detail.model';
import { VendorInvoiceProductDetail } from './vendor-invoice-product-detail.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class VendorInvoiceService{

  private vendorInvoices: VendorInvoice[] = [];
  private vendorInvoicesUpdate = new Subject<{vendorInvoices: VendorInvoice[], vendorInvoiceCount: number}>();

  constructor(private http: HttpClient, private router: Router){

  }

  getVendorInvoices(vendorInvoicesPerPage: number, currentPage: number){
    const queryParams = `?pageSize=${vendorInvoicesPerPage}&page=${currentPage}`;
    this.http.get<{message: string, vendorInvoices: any, maxVendorInvoices: number}>(
      BACKEND_URL + '/vendor-invoice/vendor-invoices' + queryParams
    )
    .pipe(map((vendorInvoiceData) => {
      return {
          vendorInvoice: vendorInvoiceData.vendorInvoices.map(vendorInvoice => {
          return {
            invoiceno: vendorInvoice.invoiceno,
            vendor: vendorInvoice.vendor,
            totalamount: vendorInvoice.totalamount,
            creator: vendorInvoice.creator,
            id: vendorInvoice._id
          };
        }),
        maxVendorInvoice: vendorInvoiceData.maxVendorInvoices
      };
    }))
    .subscribe((transformedVendorInvoicesData) => {
      this.vendorInvoices = transformedVendorInvoicesData.vendorInvoice;

      this.vendorInvoicesUpdate.next({
        vendorInvoices: [...this.vendorInvoices],
        vendorInvoiceCount: transformedVendorInvoicesData.maxVendorInvoice
      });
    });
  }

  getVendorInvoicesDetails(id: string){
    
    return this.http.get<{message: string, vendorInvoicesDetails: any, maxVendorInvoices: number}>(
      BACKEND_URL + '/vendor-invoice/vendor-invoice-details/' + id
    )
  }

  getVendorInvoicesProductDetails(vendorInvoiceDetailid: string){
    
    return this.http.get<{message: string, vendorInvoicesDetails: any, maxVendorInvoices: number}>(
      BACKEND_URL + '/vendor-invoice/vendor-invoice-product-details/' + vendorInvoiceDetailid
    )
  }

  

  getVendorInvoice(id: string) {
    return this.http.get<{
      id: string;
      invoiceno: string;
      vendor: string;
      totalamount: string;
      creator: string;
    }>(BACKEND_URL + '/vendor-invoice/vendor-invoice-get/' + id);
  }


  getMetaData() {
    return this.http.get<{vendors: [], subLocs: [], locs: [], products: []}>(BACKEND_URL + '/meta-data/get/');
  }


 
  deleteVendorInvoice(vendorInvoiceId: string) {

    return this.http.delete(BACKEND_URL + '/vendor-invoice/vendor-invoice-delete/' + vendorInvoiceId);

  }

  deleteVendorInvoiceDetail(vendorInvoiceId: string) {

    return this.http.delete(BACKEND_URL + '/vendor-invoice/vendor-invoice-detail-delete/' + vendorInvoiceId);

  }
  

  deleteVendorInvoiceProductDetails(vendorInvoiceId: string) {

    return this.http.delete(BACKEND_URL + '/vendor-invoice/vendor-invoice-product-detail-delete/' + vendorInvoiceId);

  }

  getVendorInvoiceUpdateListner(){
    return this.vendorInvoicesUpdate.asObservable();
  }

  updateVendorInvoice(id: string, invoiceno: string, vendor: string, totalamount: string) {
    let vendorInvoiceData: VendorInvoice | FormData;

    vendorInvoiceData = {
        id: id,
        invoiceno: invoiceno,
        vendor: vendor,
        totalamount: totalamount,
        creator: null,
      };

    this.http
    .put(BACKEND_URL + '/vendor-invoice/update/' + id, vendorInvoiceData)
    .subscribe(response => {
      this.router.navigate(['/list-vendor-invoice']);
    });
  }

  addVendorInvoice(invoiceno: string, vendor: string, totalamount: string, creator: string){
    const vendorInvoiceData = new FormData();
    vendorInvoiceData.append('invoiceno', invoiceno);
    vendorInvoiceData.append('vendor', vendor);
    vendorInvoiceData.append('totalamount', totalamount);
    vendorInvoiceData.append('creator', creator);

    return this.http
      .post<{ message: string, vendorInvoice: VendorInvoice }>(BACKEND_URL + '/vendor-invoice/vendor-invoice-save', vendorInvoiceData)
     
  }

  addVendorInvoiceDetail(quantity: string, product: string, vendorinvoice: string, creator: string){
    const vendorInvoiceDetailData = new FormData();
    vendorInvoiceDetailData.append('quantity', quantity);
    vendorInvoiceDetailData.append('product', product);
    vendorInvoiceDetailData.append('vendorinvoice', vendorinvoice);
    vendorInvoiceDetailData.append('creator', creator);

    return this.http
      .post<{ message: string, vendorInvoice: VendorInvoiceDetail }>(BACKEND_URL + '/vendor-invoice/vendor-invoice-detail-save', vendorInvoiceDetailData)
      
  }

  addVendorInvoiceProductDetail(serialno: string, subLoc: string, loc: string, vendorInvoiceDetailId: string, stockId: string, creator: string){
    const vendorInvoiceDetailData = new FormData();
    vendorInvoiceDetailData.append('serialno', serialno);
    vendorInvoiceDetailData.append('subloc', subLoc);
    vendorInvoiceDetailData.append('loc', loc);
    vendorInvoiceDetailData.append('vendorinvoicedetail', vendorInvoiceDetailId);
    vendorInvoiceDetailData.append('stockId', stockId);
    vendorInvoiceDetailData.append('creator', creator);

    return this.http
      .post<{ message: string, vendorInvoiceDetail: VendorInvoiceProductDetail }>(BACKEND_URL + '/vendor-invoice/vendor-invoice-product-detail-save', vendorInvoiceDetailData)
      
  }

}
