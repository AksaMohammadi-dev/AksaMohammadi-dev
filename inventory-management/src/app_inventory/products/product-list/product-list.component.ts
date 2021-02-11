import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product-service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app_inventory/auth/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit, OnDestroy {

  public products: Product[] = [];
  private productsSub: Subscription;
  totalProducts = 0;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
  userId: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  ngOnInit(){
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.productsSub = this.productsService.getProductUpdateListner()
    .subscribe((productData: {
      products: Product[], productCount: number
    }) => {
      this.isLoading = false;
      this.totalProducts = productData.productCount;
      this.products = productData.products;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(productId: string){
    this.productsService.deleteProduct(productId)
    .subscribe(
      () => {
        this.productsService.getProducts(this.productsPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(){
    this.productsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
  }

  constructor(public productsService: ProductService, private authService: AuthService){

  }
}
