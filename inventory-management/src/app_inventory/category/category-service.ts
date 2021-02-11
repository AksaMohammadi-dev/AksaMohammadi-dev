import { Category } from './category.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class CategoryService{

  private categorys: Category[] = [];
  private categorysUpdate = new Subject<{categorys: Category[], categoryCount: number}>();

  constructor(private http: HttpClient, private router: Router){

  }

  getCategorys(categorysPerPage: number, currentPage: number){
    const queryParams = `?pageSize=${categorysPerPage}&page=${currentPage}`;
    this.http.get<{message: string, categorys: any, maxCategorys: number}>(
      BACKEND_URL + '/category/categorys' + queryParams
    )
    .pipe(map((categoryData) => {
      return {
          category: categoryData.categorys.map(category => {
          return {
            id: category._id,
            name: category.name,
            creator: category.creator
          };
        }),
        maxCategory: categoryData.maxCategorys
      };
    }))
    .subscribe((transformedCategorysData) => {
      this.categorys = transformedCategorysData.category;

      this.categorysUpdate.next({
        categorys: [...this.categorys],
        categoryCount: transformedCategorysData.maxCategory
      });
    });
  }

  getCategory(id: string) {
    return this.http.get<{
      _id: string,
      name: string,
      creator: string,
      parentCategory: string
    }>(BACKEND_URL + '/category/get/' + id);
  }


 
  deleteCategory(categoryId: string) {

    return this.http.delete(BACKEND_URL + '/category/delete/' + categoryId);

  }

  getCategoryUpdateListner(){
    return this.categorysUpdate.asObservable();
  }

  updateCategory(id: string, name: string, creator: string, parentCategory: string) {
    let categoryData: Category | FormData;

    categoryData = {
        id: id,
        name: name,
        creator: null,
        parentCategory: parentCategory
      };

    this.http
    .put(BACKEND_URL + '/category/update/' + id, categoryData)
    .subscribe(response => {
      this.router.navigate(['/list-category']);
    });
  }

  addCategory(name: string, creator: string, parentCategory: string){
    const categoryData = new FormData();
    categoryData.append('name', name);
    categoryData.append('creator', creator);
    categoryData.append('parentCategory', (parentCategory ? parentCategory : null));

    this.http
      .post<{ message: string, category: Category }>(BACKEND_URL + '/category/save', categoryData)
      .subscribe(responseData => {
        this.router.navigate(['/list-category']);
      });
  }

  getMetaData() {
    return this.http.get<{categories: []}>(BACKEND_URL + '/meta-data/get/');
  }

}
