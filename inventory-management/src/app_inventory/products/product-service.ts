import { Product } from './product.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class ProductService{

  private products: Product[] = [];
  private productsUpdate = new Subject<{products: Product[], productCount: number}>();

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
            creator: product.creator,
            imagePath: product.imagePath,
            vendor: product.vendor,
            category: product.category
          };
        }),
        maxProduct: productData.maxProducts
      };
    }))
    .subscribe((transformedProductsData) => {
      this.products = transformedProductsData.product;

      this.productsUpdate.next({
        products: [...this.products],
        productCount: transformedProductsData.maxProduct
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
      imagePath: string,
      vendor: string,
      category: string
    }>(BACKEND_URL + '/product/get/' + id);
  }


 
  deleteProduct(productId: string) {

    return this.http.delete(BACKEND_URL + '/product/delete/' + productId);

  }

  getProductUpdateListner(){
    return this.productsUpdate.asObservable();
  }

  updateProduct(id: string, number: string, description: string, cgst: string, sgst: string, price: string, creator: string,
    image: File | string, vendor: string, category: string, imgToDelete: string) {
    let productData: Product | FormData;

    if(typeof(image) === 'object'){
      productData = new FormData();
      productData.append('id', id);
      productData.append('number', number);
      productData.append('description', description);
      productData.append('image', image, number);
      productData.append('cgst', cgst);
      productData.append('sgst', sgst);
      productData.append('vendor', vendor);
      productData.append('category', category);
      productData.append('imagePathToDelete', imgToDelete);
    }
    else{
      productData = {
        id: id,
        number: number,
        description: description,
        cgst: cgst,
        sgst: sgst,
        price: price,
        creator: null,
        vendor: vendor,
        category: category,
        imagePath: image,
        imagePathToDelete: '',
      };
    }

    

    this.http
    .put(BACKEND_URL + '/product/update/' + id, productData)
    .subscribe(response => {
      this.router.navigate(['/list-product']);
    });
  }

  addProduct(number: string, description: string, cgst: string, sgst: string, creator: string, price: string, image: File,vendor: string, category: string ){
    const productData = new FormData();
    productData.append('number', number);
    productData.append('description', description);
    productData.append('cgst', cgst);
    productData.append('sgst', sgst);
    productData.append('price', price);
    productData.append('image', image, number);
    productData.append('creator', creator);
    productData.append('vendor', vendor);
    productData.append('category', category);

    this.http
      .post<{ message: string, product: Product }>(BACKEND_URL + '/product/save', productData)
      .subscribe(responseData => {
        this.router.navigate(['/list-product']);
      });
  }

  getMetaData() {
    return this.http.get<{categories: [], vendors: []}>(BACKEND_URL + '/meta-data/get/');
  }

}
