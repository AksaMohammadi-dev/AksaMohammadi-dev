import { Component, Output, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../product.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import { mimeType } from './mine-type.validator';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private productId: string;
  isLoading = false;
  form: FormGroup;
  product: Product;
  imagePreview: string;
  selectedCategory: string;
  selectedVendor: string;
  disableImgBtn: boolean;
  imgToDelete: string;
  categoriesLst: [];
  vendorLst: [];
  private authStatusSubs: Subscription;

  constructor(public productService: ProductService, public authService: AuthService, public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.authStatusSubs = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      number: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, {
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        validators: [Validators.required]
      }),
      cgst: new FormControl(null, {
        validators: [Validators.required]
      }),
      sgst: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.productService.getMetaData()
    .subscribe(metaDataRes => {
      this.categoriesLst = metaDataRes.categories;
      this.vendorLst = metaDataRes.vendors;

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('productId')) {
          this.mode = 'edit';
          this.productId = paramMap.get('productId');
          this.isLoading = true;
          this.productService.getProduct(this.productId)
          .subscribe(productData => {
            this.isLoading = false;
            this.selectedCategory = productData.category;
            this.selectedVendor = productData.vendor;
            this.imagePreview = productData.imagePath;
            this.disableImgBtn = true;
            
            this.product = {
              id: productData._id,
              cgst: productData.cgst,
              sgst: productData.sgst,
              description: productData.description,
              creator: productData.creator,
              number: productData.number,
              price: productData.price,
              category: productData.category,
              imagePath: productData.imagePath || '',
              vendor: productData.vendor,
              imagePathToDelete: ''
            };
            this.form.setValue({
              cgst: this.product.cgst,
              sgst: this.product.sgst,
              description: this.product.description,
              number: this.product.number,
              price: this.product.price,
              image: this.product.imagePath,
            });
          });
        }
        else {
          this.mode = 'create';
          this.productId = null;
        }
      });
    })
    
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }

  onSaveProduct() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {

      this.productService.addProduct(
        this.form.value.number,
        this.form.value.description,
        this.form.value.cgst,
        this.form.value.sgst,
        this.form.value.creator,
        this.form.value.price,
        this.form.value.image,
        this.selectedVendor,
        this.selectedCategory);
    }
    else {

      this.productService.updateProduct(
        this.productId,
        this.form.value.number,
        this.form.value.description,
        this.form.value.cgst,
        this.form.value.sgst,
        this.form.value.creator,
        this.form.value.price,
        this.form.value.image,
        this.selectedVendor,
        this.selectedCategory,
        this.imgToDelete);
    }


    this.form.reset();
  }

  selectedCategoryValue(event: MatSelectChange) {
    this.selectedCategory = event.value;
  }

  selectedVendorValue(event: MatSelectChange) {
    this.selectedVendor = event.value;
  }

  deleteImg(){
    this.disableImgBtn = false;

    if(!this.imgToDelete){ //assign only once
      this.imgToDelete = this.imagePreview ;
    }
    this.imagePreview = '';
  }

  onImagePick(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
