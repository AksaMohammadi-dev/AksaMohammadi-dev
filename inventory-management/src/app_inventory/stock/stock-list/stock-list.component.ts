import { Component, OnInit,ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import { ClientService } from 'src/app_inventory/clients/client-service';
import { Client } from 'src/app_inventory/clients/client.model';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {

  public prod_details = [];
  public stock_details = [];
  public stocks = [];

  private clientsSub: Subscription;
  totalClients = 0;
  clientsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
  userId: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  
  constructor(public stockService: StockService, private authService: AuthService){

  }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.clientsSub = this.stockService.getAllStocks()
    .subscribe((stockData: any) => {
      this.stocks = stockData.Stock;
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
      
  ngOnDestroy(){
    this.clientsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.clientsPerPage = pageData.pageSize;
  }

}
