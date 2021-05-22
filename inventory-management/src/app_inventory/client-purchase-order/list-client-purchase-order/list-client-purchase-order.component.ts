import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import { ClientPurchaseOrderServiceService } from '../client-purchase-order-service.service';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-list-client-purchase-order',
  templateUrl: './list-client-purchase-order.component.html',
  styleUrls: ['./list-client-purchase-order.component.css']
})
export class ListClientPurchaseOrderComponent implements OnInit {

  
  public clientsPO = [];
  private clientsSub: Subscription;
  totalClientsPO = 0;
  clientsPOPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [ 5, 10,20,30];
  isLoading = false;
  userId: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  ngOnInit(){
    this.clientPOservice.getAllClientPO(this.currentPage,this.clientsPOPerPage).subscribe((POs: any) => {
      this.clientsPO = POs.ClientPurchaseOrder;
      this.totalClientsPO = POs.maxClientPurchaseOrder,
      this.isLoading = false;
    });
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    // this.clientsSub = this.clientPOservice.getClientUpdateListner()
    // .subscribe((clientData: {
    //   clients: Client[], clientCount: number
    // }) => {
    //   this.isLoading = false;
    //   this.totalClients = clientData.clientCount;
    //   this.clients = clientData.clients;
    // });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(POId: string){
    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to delete this purchase order, You will not be able to recover this purchase order!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.clientPOservice.deleteClientPO(POId).subscribe((deleted:any) => {
          if(deleted.status){
            Swal.fire(
              'Deleted!',
              'Your Purchase Order has been deleted.',
              'success'
            )
           
            this.clientPOservice.getAllClientPO(this.currentPage,this.clientsPOPerPage).subscribe((POs: any) => {
              this.clientsPO = POs.ClientPurchaseOrder;
              this.totalClientsPO = POs.maxClientPurchaseOrder,
              this.isLoading = false;
            });
          }else{
            Swal.fire(
              'Deleted!',
              'something went wrong.! while deleting client purchase order.',
              'error'
            )
          }
        }, () => {
          this.isLoading = false;
        });        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Purchase order is safe :)',
          'error'
        )
      }
    })
    // this.clientPOservice.deleteClientPO(POId)
    // .subscribe(
    //   () => {
    //     this.clientPOservice.getAllClientPO().subscribe((POs: any) => {
    //       this.clientsPO = POs.ClientPurchaseOrder;
    //       this.totalClientsPO = POs.maxClientPurchaseOrder,
    //       this.isLoading = false;
    //     });
    //   }, () => {
    //     this.isLoading = false;
    //   }
    // );
  }

  showPO = false;
  showPOFn(){
    this.showPO = true;
  }
  // ngOnDestroy(){
  //   this.clientsSub.unsubscribe();
  //   this.authStatusSub.unsubscribe();
  // }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.clientsPOPerPage = pageData.pageSize;
    // this.clientPOservice.getAllClientPO(this.currentPage,this.clientsPOPerPage);
    this.clientPOservice.getAllClientPO(this.currentPage,this.clientsPOPerPage).subscribe((POs: any) => {
      this.clientsPO = POs.ClientPurchaseOrder;
      this.totalClientsPO = POs.maxClientPurchaseOrder,
      this.isLoading = false;
    });
    this.isLoading = true;
  }



  constructor( private authService: AuthService ,private clientPOservice:ClientPurchaseOrderServiceService) { }


}
