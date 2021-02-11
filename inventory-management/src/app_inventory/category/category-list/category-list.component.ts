import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Category } from '../category.model';
import { CategoryService } from '../category-service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app_inventory/auth/auth.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})

export class CategoryListComponent implements OnInit, OnDestroy {

  public categorys: Category[] = [];
  private categorysSub: Subscription;
  totalCategorys = 0;
  categorysPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
  userId: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  ngOnInit(){
    this.categorysService.getCategorys(this.categorysPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.categorysSub = this.categorysService.getCategoryUpdateListner()
    .subscribe((categoryData: {
      categorys: Category[], categoryCount: number
    }) => {
      this.isLoading = false;
      this.totalCategorys = categoryData.categoryCount;
      this.categorys = categoryData.categorys;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(categoryId: string){
    this.categorysService.deleteCategory(categoryId)
    .subscribe(
      () => {
        this.categorysService.getCategorys(this.categorysPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(){
    this.categorysSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.categorysPerPage = pageData.pageSize;
    this.categorysService.getCategorys(this.categorysPerPage, this.currentPage);
  }

  constructor(public categorysService: CategoryService, private authService: AuthService){

  }
}
