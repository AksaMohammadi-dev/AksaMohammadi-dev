import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import Swal from 'sweetalert2'
import { Subscription } from 'rxjs';
import { ClientPurchaseOrderServiceService } from '../client-purchase-order-service.service';
import { ClientPODetails } from '../client-purchase-order.model';

@Component({
  selector: 'app-create-client-purchase-order',
  templateUrl: './create-client-purchase-order.component.html',
  styleUrls: ['./create-client-purchase-order.component.css']
})
export class CreateClientPurchaseOrderComponent implements OnInit {
  isLoading = false;
  userId: string;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  private allClientsPO: Subscription;
  public ClientPODetail: ClientPODetails[] = [];

  constructor( private authService: AuthService ,private clientPOservice:ClientPurchaseOrderServiceService) { }

  allPOs = [];
  products =[];
  POnum;
  created = true;
  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.clientPOservice.getProducts().subscribe((res:any)=>{
      this.products = res.products
    })
    this.allClientsPO = this.clientPOservice.getAllClientPOs().subscribe((POs: any) => {
      this.allPOs = POs.ClientPurchaseOrder;
      this.isLoading = false;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  clientPOId;
  openDialog(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You wanted to raise a Purchase Order',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.clientPOservice.createClientPO(this.POnum).subscribe((PO: any) => {
          if(PO.status){
            this.created = false;
            this.clientPOId = PO.clientPurchaseOrder._doc._id
            this.POnum = PO.clientPurchaseOrder._doc.ponumber
            Swal.fire(
              'Success!',
              "Your Purcahse order '"+this.POnum+"' has been raised successfully.",
              'success'
            )
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          "Purchase order has been cancelled",
          'error'
        )
      }
    })
  }
date;
  setDate(date: string) {
    this.date = date ? date : '';
  }

  onAddPODetails(){
    // debugger;
    let ClientPODetail = {} as ClientPODetails;
    // ClientPODetail.creator = '';
    // ClientPODetail.id = '';
    ClientPODetail.clientPOId = this.clientPOId,
    ClientPODetail.productId = '',
    ClientPODetail.quantity = '',
    ClientPODetail.scheduledDate = '';
    ClientPODetail.status = ''

    this.ClientPODetail.push(ClientPODetail);
  }

  onSaveClientPO(po){
    this.clientPOservice.createClientPODetails(po).subscribe((PO: any) => {
      if(PO.status){
        this.created = false;
        Swal.fire(
          'Success!',
          "Your Purcahse order details has been raised successfully.",
          'success'
        )
      }
    })
  }

}
