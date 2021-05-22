import { Component, OnInit } from '@angular/core';
import { ClientPurchaseOrderServiceService } from '../client-purchase-order-service.service';
import { ClientPaymentDetails } from '../client-payment.model'
@Component({
  selector: 'app-client-payment',
  templateUrl: './client-payment.component.html',
  styleUrls: ['./client-payment.component.css']
})
export class ClientPaymentComponent implements OnInit {
  clients:any = [];
  selected_id:any;
  selected_invoices:any;

  constructor(private clientPOservice:ClientPurchaseOrderServiceService) { }
  public ClientPaymentDetails: ClientPaymentDetails[] = [];
  create:any = false;

  ngOnInit() {
    this.getAllClients();
  }

  getAllClients(){
    this.clientPOservice.getAllClients().subscribe((res:any)=>{
      if(res.clients){
        res.clients.forEach(element => {
          this.clients.push({id:element._id,name:element.name})
        });
      }else{
        console.log('no reocrds found..!!')
      }
    })
  }
  invoices:any;
  ponumber:any;
  clientInvoicesInfo:any = []
  getInvoices(){
    this.clientPOservice.getAllClientInvoices(this.selected_id).subscribe((res:any)=>{
      if(res.status){
        this.ponumber = res.details[0].ponumber
        this.invoices = [].concat.apply([], res.invoices);
        this.invoices = this.invoices.filter(function (el) {return el != null;});
        console.log(this.invoices);
        this.clientInvoicesInfo = res;
      }else{
        console.log('no reocrds found..!!')
      }
    })
  }

  date;
  setDate(date: string) {
    this.date = date ? date : '';
  }

  
  totalAmount:any;
  bal:any;
  dataLength:any = false;
  getInvoiceDetails(){
    this.create = true;
    let variable = this.selected_invoices;
    
    let obj = this.clientInvoicesInfo.details[0].productDetails.find(o => o.invoiceNo == variable);
    this.totalAmount = obj.amount;

    this.clientPOservice.getInvoiceDetails(this.selected_invoices).subscribe((res:any)=>{
      if(res.status){
        if(res.data.length){
          this.dataLength = true;
        }else{
          this.dataLength = false;
        }

        var length = res.data.length;
        if(length){
          let obj = res.data[length-1]
          this.bal = obj.bal;
        }else{
          this.bal = this.totalAmount
        }
        this.ClientPaymentDetails = res.data;
      }else{
        console.log('no reocrds found..!!')
      }
    })
  }

  onAddPODetails(){
    // debugger;
    let course = {} as ClientPaymentDetails;
    course.ponumber = this.ponumber;
    course.invoicenumber = this.selected_invoices;
    course.client = this.selected_id;
    course.amount = "";
    course.bal = this.bal;
    course.totalAmount = this.totalAmount;
    course.modeofpayment = "";
    course.paymentslipref = "";
    course.paymentlocation = "";
    course.paymentDate = "";

    this.ClientPaymentDetails.push(course);
  }

  updateClientInvoicePayment(row){
    if(!this.dataLength){
      row.bal = JSON.stringify(JSON.parse(row.totalAmount) - JSON.parse(row.amount));
    }else{
      if(row.bal !=0){
        row.bal = JSON.stringify(JSON.parse(row.bal) - JSON.parse(row.amount));
      }else{
        this.create = false;
        row.bal = 0;
      }
    }
    row.remark = 'done';
    row.client = this.selected_id;
    this.clientPOservice.saveClientInvoiceDetails(row).subscribe((res:any)=>{
      if(res.status){
        this.clientPOservice.getInvoiceDetails(this.selected_invoices).subscribe((res:any)=>{
          if(res.status){
            this.create = false;
            this.ClientPaymentDetails = res.data;
          }else{
            this.create = false;
            console.log('no reocrds found..!!')
          }
        })
      }else{
        this.create = false;
        console.log('no reocrds found..!!')
      }
    })
  }
}
