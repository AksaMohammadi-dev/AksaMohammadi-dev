import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class ClientPurchaseOrderServiceService {

  constructor(private http: HttpClient, private router: Router){  }

  getAllClientPO(productsPerPage,currentPage) {
    const queryParams = `?pageSize=${productsPerPage}&page=${currentPage}`;

    return this.http.get<{
     
    }>(BACKEND_URL + '/client-purchase-order/client-purchase-order' + queryParams);
  }

  getAllClients() {
    // const queryParams = `?pageSize=${productsPerPage}&page=${currentPage}`;

    return this.http.get<{
     
    }>(BACKEND_URL + '/client/clients');
  }

  getAllClientInvoices(id:any) {

    return this.http.get<{
     
    }>(BACKEND_URL + '/client-payment-management/client-invoices/'+id);
  }

  getAllClientPOs() {

    return this.http.get<{
     
    }>(BACKEND_URL + '/client-purchase-order/client-purchase-order');
  }

  getClientInvoiceNumber() {

    return this.http.get<{
     
    }>(BACKEND_URL + '/client-purchase-order-detail/getClientInvoiceNumber');
  }

  getProducts() {
    return this.http.get<{
     
    }>(BACKEND_URL + '/product/products');
  }

  getClientPOByClientId(param) {
    return this.http.get<{
     
    }>(BACKEND_URL + '/client-purchase-order/getClientPOByClientId/'+param);
  }

  getInvoiceDetails(param) {
    return this.http.get<{
     
    }>(BACKEND_URL + '/client-payment-management/client-payment-management-detail-get/'+param);
  }

  saveClientInvoiceDetails(obj) {
    return this.http.post<{
     
    }>(BACKEND_URL + '/client-payment-management/save-client-payment',obj);
  }

  getClientPaymentManagement(){
    return this.http.get<{
     
    }>(BACKEND_URL + '/client-payment-management/client-payment-management');
  } 

  getSerialNoByProductId(param) {
    return this.http.get<{
     
    }>(BACKEND_URL + '/client-purchase-order-detail/serial-no-by-productId-get/'+param);
  }

  getPOforPO_num(obj){
    return this.http.post<{
     
    }>(BACKEND_URL + '/client-purchase-order/getPOforPO_num',{"ponumber":obj});
  }
  createClientPO(POnum:any){
    return this.http.post<{
     
    }>(BACKEND_URL + '/client-purchase-order/save-client-purchase-order',{"ponumber": POnum} );
  }

  deleteClientPO(PO_id:any){
    return this.http.delete<{
     
    }>(BACKEND_URL + '/client-purchase-order/delete-client-purchase-order/'+PO_id );
  }

  createClientPODetails(obj:any){
    return this.http.post<{
     
    }>(BACKEND_URL + '/client-purchase-order-detail/save-client-purchase-order-detail',obj );
  }

  updateClientPurchaseOrderDetail(id:any,obj:any){
    return this.http.put<{
     
    }>(BACKEND_URL + '/client-purchase-order-detail/update-client-purchase-order-detail/'+id,obj );
  }

  updateClientPurchaseOrderByInvoiceDetials(obj:any){
    return this.http.put<{
     
    }>(BACKEND_URL + '/client-purchase-order-detail/update-client-purchase-order-by-invoice-detials/'+obj._id,obj );
  }

  removeStockDetialsAndStockQty(obj:any){
    return this.http.put<{
    }>(BACKEND_URL + '/client-purchase-order-detail/removeStockDetialsAndStockQty',obj );
  }

  getSingleClientPurchaseOrder(PO_id:any){
    return this.http.get<{
     
    }>(BACKEND_URL + '/client-purchase-order/client-purchase-order-get/'+PO_id );
  }

  deleteClientPurchaseOrderDetail(PO_id:any){
    return this.http.delete<{
     
    }>(BACKEND_URL + '/client-purchase-order-detail/delete-client-purchase-order-detail/'+PO_id );
  }


  
}
