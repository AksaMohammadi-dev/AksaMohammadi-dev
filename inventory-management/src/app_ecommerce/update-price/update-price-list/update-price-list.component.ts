import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { UpdatePrice } from '../update-price.model';
import { UpdatePriceService } from '../update-price-service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app_ecommerce/auth/auth.service';

@Component({
  selector: 'app-update-price-list',
  templateUrl: './update-price-list.component.html',
  styleUrls: ['./update-price-list.component.css']
})

export class UpdatePriceListComponent implements OnInit, OnDestroy {

  public updatePrices: UpdatePrice[] = [];
  private updatePricesSub: Subscription;
  totalUpdatePrices = 0;
  updatePricesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
  userId: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  ngOnInit(){
    this.updatePricesService.getProducts(this.updatePricesPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.updatePricesSub = this.updatePricesService.getUpdatePriceUpdateListner()
    .subscribe((updatePriceData: {
      updatePrices: UpdatePrice[], updatePriceCount: number
    }) => {
      this.isLoading = false;
      this.totalUpdatePrices = updatePriceData.updatePriceCount;
      this.updatePrices = updatePriceData.updatePrices;
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
    this.updatePricesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.updatePricesPerPage = pageData.pageSize;
    this.updatePricesService.getProducts(this.updatePricesPerPage, this.currentPage);
  }

  constructor(public updatePricesService: UpdatePriceService, private authService: AuthService){

  }
}
