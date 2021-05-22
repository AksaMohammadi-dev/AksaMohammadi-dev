import { Component, AfterViewInit,OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material";
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Observable, merge } from 'rxjs';
import { VendorPaymentManagementService } from 'src/app_inventory/vendor-payment-management/vendor-payment-management-service';
import { ClientPurchaseOrderServiceService } from 'src/app_inventory/client-purchase-order/client-purchase-order-service.service';
class Todo {
  "ponumber" : String;
  "invoicenumber" : String;
  "amount" : String;
  "modeofpayment" : String;
  "paymentslipref" : String;
  "paymentlocation" : String;
  "vendorName" : string;
}

class Todo1 {
  "client_ponumber" : String;
  "client_invoicenumber" : String;
  "client_amount" : String;
  "client_totalAmount" : String;
  "client_bal" : String;
  "client_modeofpayment" : String;
  "client_paymentslipref" : String;
  "client_paymentlocation" : String;
  "clientName" : string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(public venPayService : VendorPaymentManagementService,public clientPayService : ClientPurchaseOrderServiceService) { 
  }


  form:FormGroup = new FormGroup({
    ponumber: new FormControl(false),
    invoicenumber: new FormControl(false),
    amount: new FormControl(false),
    modeofpayment : new FormControl(false),
    paymentslipref : new FormControl(false),
    paymentlocation : new FormControl(false),
    vendorName : new FormControl(false)
  });

  form1:FormGroup = new FormGroup({
    client_ponumber: new FormControl(false),
    client_invoicenumber: new FormControl(false),
    client_amount: new FormControl(false),
    client_totalAmount: new FormControl(false),
    client_bal: new FormControl(false),
    client_modeofpayment : new FormControl(false),
    client_paymentslipref : new FormControl(false),
    client_paymentlocation : new FormControl(false),
    clientName : new FormControl(false)
  });

  ponumber = this.form.get('ponumber');
  invoicenumber = this.form.get('invoicenumber');
  amount = this.form.get('amount');
  modeofpayment = this.form.get('modeofpayment');
  paymentslipref = this.form.get('paymentslipref');
  paymentlocation = this.form.get('paymentlocation');
  vendorName = this.form.get('vendorName');

  client_ponumber = this.form1.get('client_ponumber');
  client_invoicenumber = this.form1.get('client_invoicenumber');
  client_amount = this.form1.get('client_amount');
  client_totalAmount = this.form1.get('client_totalAmount');
  client_bal = this.form1.get('client_bal');
  client_modeofpayment = this.form1.get('client_modeofpayment');
  client_paymentslipref = this.form1.get('client_paymentslipref');
  client_paymentlocation = this.form1.get('client_paymentlocation');
  clientName = this.form1.get('clientName');
  
  columnDefinitions = [
    { def: 'ponumber', label: 'PO Number', hide: this.ponumber.value},
    { def: 'vendorName', label: 'Vendor Name', hide: this.vendorName.value},
    { def: 'invoicenumber', label: 'Invoice Number', hide: this.invoicenumber.value},
    { def: 'amount', label: 'Amount', hide: this.amount.value},
    { def: 'modeofpayment', label: 'Mode of Payment', hide: this.modeofpayment.value},
    { def: 'paymentslipref', label: 'Payment Slip Ref', hide: this.paymentslipref.value},
    { def: 'paymentlocation', label: 'Payment Location', hide: this.paymentlocation.value},
  ]

  clientColumnDefinitions = [
    { def: 'client_ponumber', label: 'PO Number', hide: this.client_ponumber.value},
    { def: 'clientName', label: 'client Name', hide: this.clientName.value},
    { def: 'client_invoicenumber', label: 'Invoice Number', hide: this.client_invoicenumber.value},
    { def: 'client_amount', label: 'Amount', hide: this.client_amount.value},
    { def: 'client_totalAmount', label: 'totalAmount', hide: this.client_totalAmount.value},
    { def: 'client_bal', label: 'bal', hide: this.client_bal.value},
    { def: 'client_modeofpayment', label: 'Mode of Payment', hide: this.client_modeofpayment.value},
    { def: 'client_paymentslipref', label: 'Payment Slip Ref', hide: this.client_paymentslipref.value},
    { def: 'client_paymentlocation', label: 'Payment Location', hide: this.client_paymentlocation.value},
  ]

  getDisplayedColumns():string[] {
    return this.columnDefinitions.filter(cd=>cd.hide).map(cd=>cd.def);
  }

  getClientDisplayedColumns():string[] {
    return this.clientColumnDefinitions.filter(cd=>cd.hide).map(cd=>cd.def);
  }
  
  dataSource: MatTableDataSource<Todo>;
  dataSource1: MatTableDataSource<Todo1>;
  ngAfterViewInit() {
   let o1:Observable<boolean> = this.ponumber.valueChanges;
   let o2:Observable<boolean> = this.vendorName.valueChanges;
   let o3:Observable<boolean> = this.invoicenumber.valueChanges;
   let o4:Observable<boolean> = this.amount.valueChanges;
   let o5:Observable<boolean> = this.modeofpayment.valueChanges;
   let o6:Observable<boolean> = this.paymentslipref.valueChanges;
   let o7:Observable<boolean> = this.paymentlocation.valueChanges;

   let c1:Observable<boolean> = this.client_ponumber.valueChanges;
   let c2:Observable<boolean> = this.clientName.valueChanges;
   let c3:Observable<boolean> = this.client_invoicenumber.valueChanges;
   let c4:Observable<boolean> = this.client_amount.valueChanges;
   let c5:Observable<boolean> = this.client_totalAmount.valueChanges;
   let c6:Observable<boolean> = this.client_bal.valueChanges;
   let c7:Observable<boolean> = this.client_modeofpayment.valueChanges;
   let c8:Observable<boolean> = this.client_paymentslipref.valueChanges;
   let c9:Observable<boolean> = this.client_paymentlocation.valueChanges;
  


   merge(o1, o2, o3, o4, o5, o6, o7).subscribe( v=>{
   this.columnDefinitions[0].hide = this.ponumber.value;
   this.columnDefinitions[1].hide = this.vendorName.value;
   this.columnDefinitions[2].hide = this.invoicenumber.value;
   this.columnDefinitions[3].hide = this.amount.value;
   this.columnDefinitions[4].hide = this.modeofpayment.value;
   this.columnDefinitions[5].hide = this.paymentslipref.value;
   this.columnDefinitions[6].hide = this.paymentlocation.value;

  });

  merge(c1, c2, c3, c4, c5, c6, c7, c8, c9).subscribe( v=>{
    this.clientColumnDefinitions[0].hide = this.client_ponumber.value;
    this.clientColumnDefinitions[1].hide = this.clientName.value;
    this.clientColumnDefinitions[2].hide = this.client_invoicenumber.value;
    this.clientColumnDefinitions[3].hide = this.client_amount.value;
    this.clientColumnDefinitions[4].hide = this.client_totalAmount.value;
    this.clientColumnDefinitions[5].hide = this.client_bal.value;
    this.clientColumnDefinitions[6].hide = this.client_modeofpayment.value;
    this.clientColumnDefinitions[7].hide = this.client_paymentslipref.value;
    this.clientColumnDefinitions[8].hide = this.client_paymentlocation.value;    
 
  });
  }

  ngOnInit() {
    this.venPayService.getVenPaymentManagement().subscribe((paymentData: any) => {
     const todos = paymentData.vendorPaymentManagements;
     this.dataSource = new MatTableDataSource(todos);    
    });

    this.clientPayService.getClientPaymentManagement().subscribe((paymentData: any) => {
      const todos = paymentData.ClientPayments;
      this.dataSource1 = new MatTableDataSource(todos);    
     });
  }

  venRep = false;
  cliRep = false;
  vendorReports(){
    this.cliRep = false;
    this.venRep = true;
  }

  clientReports(){
    this.venRep = false;
    this.cliRep = true;
  }

}
