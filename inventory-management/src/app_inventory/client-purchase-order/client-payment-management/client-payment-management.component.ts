import { Component, OnInit } from '@angular/core';
import { ClientPurchaseOrderServiceService } from '../client-purchase-order-service.service';
import {FormBuilder, FormControl, FormGroup, FormArray, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import { VendorInvoiceService } from 'src/app_inventory/vendor-invoice/vendor-invoice-service';

@Component({
  selector: 'app-client-payment-management',
  templateUrl: './client-payment-management.component.html',
  styleUrls: ['./client-payment-management.component.css']
})
export class ClientPaymentManagementComponent implements OnInit {
  clients:any = [];
  ponumber:any = [];
  locations:any = [];
  subLocations:any = [];
  public invoice_no:any = '';
  selected_id:any;
  selected_po:any;
  noPO:boolean = false;
  constructor(private clientPOservice:ClientPurchaseOrderServiceService,public invoiceService: VendorInvoiceService, public authService: AuthService,public route: ActivatedRoute, private fb: FormBuilder) { }
  addPOForm = new FormGroup({
    prodId: new FormControl('Validators.required'),
    prodQty: new FormControl(''),
    prodSchDate: new FormControl(''),
    prodStatus: new FormControl('')
  });
  ngOnInit() {
    this.addPOForm = this.fb.group({
      prodId: ['', Validators.required],
      prodQty: ['', Validators.required],
      prodSchDate: ['', [Validators.required]],
      prodStatus: ['',  Validators.required],
    });
    this.getAllClients();
    this.invoiceService.getMetaData().subscribe(metaDataRes => {
      
      // this.vendors = metaDataRes.vendors;
      this.locations = metaDataRes.locs;
      this.subLocations = metaDataRes.subLocs;
      // this.products = metaDataRes.products;
     
    });
    this.clientPOservice.getClientInvoiceNumber().subscribe((invoice:any)=> {
      if(invoice.status){
        this.invoice_no = invoice.invoiceNo
      }
    })
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
  rows = [];
  getPO(){
    this.clientPOservice.getClientPOByClientId(this.selected_id).subscribe((res:any)=>{
      if(res.clientPurchaseOrder.length >0){
        this.noPO = false;
        this.ponumber = [];
        this.rows = [];
        res.clientPurchaseOrder.forEach(element => {        
          this.ponumber.push({id:element._id,ponumber:element.ponumber})
        });
      }else{
        this.noPO = true;
        console.log('no reocrds found.!')
      }
    })
  }
  table:boolean=false;
  getDetails(){
    this.clientPOservice.getPOforPO_num(this.selected_po).subscribe((res:any)=>{
      this.table = true;
      if(res.length){
        this.table = true;
        var columns = [];
        this.rows = [];
        this.rows = res;
        this.rows.forEach(element => {
          if (element.clientPurchaseOrderDetails.length >0) {
            element.clientPurchaseOrderDetails.map(function(value, index) {
              value.serialno = element.serialno[index]
            });
          }
        });
        this.rows = this.rows;
       
      }else{
        console.log('no reocrds found..!!')
      }
    })
  }
  isInvoiced = false;
  updateInvoice(selectedRow){
    if(selectedRow.quantity == selectedRow.selectedSerialnoDetails.length){
      this.clientPOservice.updateClientPurchaseOrderByInvoiceDetials(selectedRow).subscribe((updatedResult:any)=>{
        Swal.fire(
          'Success!',
          "Client Invoice has been generated successfully.!",
          'success'
        )
        this.clientPOservice.removeStockDetialsAndStockQty({productId:selectedRow.productId,quantity:selectedRow.quantity,selectedSerialnoDetails:selectedRow.selectedSerialnoDetails}).subscribe((stocksdeleted:any)=>{
          console.log('####stock detail are updated#####')
        })
      })
    }else{
      Swal.fire(
        'Something went wrong.!',
        "please select same number of serial numbers as per to quantity.!",
        'error'
      )
    }
  }

  result:any;
  show=false;
  getSerailNo(selectedRow){
    this.clientPOservice.getSerialNoByProductId(selectedRow.productId).subscribe((res:any)=>{
      this.result = res;
      selectedRow.editable = true;
      this.show =true;

    })
  }
}
