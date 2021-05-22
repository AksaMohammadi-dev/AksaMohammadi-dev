import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import { ClientPurchaseOrderServiceService } from '../client-purchase-order-service.service';
import { MatTableDataSource } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import Swal from 'sweetalert2'
import { ClientPODetails } from '../client-purchase-order.model';
import {FormBuilder, FormControl, FormGroup, FormArray, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-client-purchase-order',
  templateUrl: './edit-client-purchase-order.component.html',
  styleUrls: ['./edit-client-purchase-order.component.css']
})
export class EditClientPurchaseOrderComponent implements OnInit {

  constructor(public clientPOService: ClientPurchaseOrderServiceService, public authService: AuthService, public route: ActivatedRoute, private fb: FormBuilder) { }
  PO_id;
  mode;
  dataLength;
  isLoading = false;
  userId: string;
  po_num;
  clientPOId;
  products =[];

  public ClientPODetail: ClientPODetails[] = [];
  
  public displayedColumns = [
    'PO_num',
    'scheduled_date',
    'status',
    'productId',
    'quantity',
    'delete',
     'edit'
  ];
  public dataSource = new MatTableDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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
    this.clientPOService.getProducts().subscribe((res:any)=>{
      this.products = res.products
    })
    this.dataSource.paginator = this.paginator;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('PO_id')) {
        this.mode = 'edit';
        this.PO_id = paramMap.get('PO_id');
        this.isLoading = true;
        this.clientPOService.getSingleClientPurchaseOrder(this.PO_id).subscribe((data:any) => {
          if(data.status){
            this.clientPOId = data.clientPurchaseOrder._id;
            this.po_num = data.clientPurchaseOrder.ponumber
            this.dataLength = data.clientPurchaseOrderDetails.length;
            this.dataSource.data = data.clientPurchaseOrderDetails;
          }
        });
      }
    });
  }

  deleteRecord(row){
    console.log('&&&&77',row)
    Swal.fire({
      title: 'Are you sure?',
      text: "You wanted to delete Purchase Order details raise for product '"+ row.productId+"'",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        console.log('************',row._id)
        this.clientPOService.deleteClientPurchaseOrderDetail(row._id).subscribe((PO: any) => {
          if(PO.status){
            this.clientPOService.getSingleClientPurchaseOrder(this.PO_id).subscribe((data:any) => {
              if(data.status){
                this.po_num = data.clientPurchaseOrder.ponumber
                this.dataLength = data.clientPurchaseOrderDetails.length;
                this.dataSource.data = data.clientPurchaseOrderDetails;
              }
            });
            Swal.fire(
              'Success!',
              "Your Purcahse order details for product '"+row.productId+"' has been deleted successfully.",
              'success'
            )
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          "Your Purchase order details are safe",
          'error'
        )
      } else{
        Swal.fire(
          'Cancelled',
          "something went wrong, please try again later",
          'error'
        )
      }
    })
  }

  addShow = false;
  editShow = false;
  // onAddPODetails(){
  //   this.show = true
  // }
  date;
  setDate(date: string) {
    this.date = date ? date : '';
  }
  row :any;

  onAddPODetails(){
    this.addShow = true
    // debugger;
    let ClientPODetail = {} as ClientPODetails;
    // ClientPODetail.creator = '';
    // ClientPODetail.id = '';
    // ClientPODetail.clientPOId = this.clientPOId,
    // ClientPODetail.productId = '',
    // ClientPODetail.quantity = '',
    // ClientPODetail.scheduledDate = '';
    // ClientPODetail.status = ''

    // this.row.push(ClientPODetail);
  }


  onSaveClientPO(){
    let po ={
      "clientPOId": this.clientPOId,
      "productId" :this.addPOForm.get("prodId").value,
      "quantity": this.addPOForm.get("prodQty").value,
      "scheduledDate": this.addPOForm.get("prodSchDate").value,
      "status": this.addPOForm.get("prodStatus").value
    }
    this.clientPOService.createClientPODetails(po).subscribe((PO: any) => {
      if(PO.status){
        this.addShow = false;
        console.log(PO)
        this.clientPOService.getSingleClientPurchaseOrder(this.PO_id).subscribe((data:any) => {
          if(data.status){
            this.clientPOId = data.clientPurchaseOrder._id;
            this.po_num = data.clientPurchaseOrder.ponumber
            this.dataLength = data.clientPurchaseOrderDetails.length;
            this.dataSource.data = data.clientPurchaseOrderDetails;
          }
        });
        Swal.fire(
          'Success!',
          "Your Purcahse order details has been raised successfully.",
          'success'
        )
      }else{
        Swal.fire(
          'Cancelled',
          "something went wrong, please try again later",
          'error'
        )
      }
    })
  }
  editRecord(row){
    this.row = row;
    this.editShow = true;
  }
  editRow(id){
    Swal.fire({
      title: 'Are you sure?',
      text: "You wanted to edit Purchase Order details raise for product '"+ this.row.productId+"'",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.clientPOService.updateClientPurchaseOrderDetail(id,this.row).subscribe((updatedPO: any) => {
          if(updatedPO.status){
            this.editShow = false;
            this.clientPOService.getSingleClientPurchaseOrder(this.PO_id).subscribe((data:any) => {
              if(data.status){
                this.po_num = data.clientPurchaseOrder.ponumber
                this.dataLength = data.clientPurchaseOrderDetails.length;
                this.dataSource.data = data.clientPurchaseOrderDetails;
              }
            });
            Swal.fire(
              'Success!',
              "Your Purcahse order details for product '"+this.row.productId+"' has been edited successfully.",
              'success'
            )
          }else{
            Swal.fire(
              'Cancelled',
              "something went wrong, please try again later",
              'error'
            )
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          "Your Purchase order details are not edited",
          'error'
        )
      }
    })
  }

}
