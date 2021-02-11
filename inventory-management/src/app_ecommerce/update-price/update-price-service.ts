import { UpdatePrice } from './update-price.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class UpdatePriceService{

  private updatePrices: UpdatePrice[] = [];
  private updatePriceUpdate = new Subject<{updatePrices: UpdatePrice[], updatePriceCount: number}>();

  constructor(private http: HttpClient, private router: Router){

  }

  getProducts(productsPerPage: number, currentPage: number){
    const queryParams = `?pageSize=${productsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, products: any, maxProducts: number}>(
      BACKEND_URL + '/product/products' + queryParams
    )
    .pipe(map((productData) => {
      return {
          product: productData.products.map(product => {
          return {
            number: product.number,
            description: product.description,
            id: product._id,
            cgst: product.cgst,
            sgst: product.sgst,
            price: product.price,
            sellPrice: product.sellPrice,
            creator: product.creator
          };
        }),
        maxProduct: productData.maxProducts
      };
    }))
    .subscribe((transformedProductsData) => {
      this.updatePrices = transformedProductsData.product;

      this.updatePriceUpdate.next({
        updatePrices: [...this.updatePrices],
        updatePriceCount: transformedProductsData.maxProduct
      });
    });
  }

  getProduct(id: string) {
    return this.http.get<{
      _id: string,
      number: string,
      description: string,
      cgst: string,
      sgst: string,
      price: string,
      creator: string,
      sellPrice: string
    }>(BACKEND_URL + '/product/get/' + id);
  }

  getUpdatePriceUpdateListner(){
    return this.updatePriceUpdate.asObservable();
  }

  updateProductPrice(id: string, number: string, creator: string, sellPrice: string) {
    let updatePriceData: UpdatePrice | FormData;

    updatePriceData = {
        id: id,
        number: number,
        creator: creator,
        sellPrice: sellPrice,
        sgst: null,
        cgst: null,
        price: null,
        description: null
      };

    this.http
    .put(BACKEND_URL + '/product/updateProductSellPrice/' + id, updatePriceData)
    .subscribe(response => {
      this.router.navigate(['/list-update-price']);
    });
  }

}
