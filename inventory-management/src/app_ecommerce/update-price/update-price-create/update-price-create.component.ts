import { Component, Output, OnInit, OnDestroy } from '@angular/core';
import { UpdatePriceService } from '../update-price-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UpdatePrice } from '../update-price.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app_inventory/auth/auth.service';

@Component({
  selector: 'app-update-price-create',
  templateUrl: './update-price-create.component.html',
  styleUrls: ['./update-price-create.component.css']
})
export class UpdatePriceCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private updatePriceId: string;
  isLoading = false;
  form: FormGroup;
  updatePrice: UpdatePrice;
  imagePreview: string;
  private authStatusSubs: Subscription;

  constructor(public updatePriceService: UpdatePriceService, public authService: AuthService, public route: ActivatedRoute) {

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
      price: new FormControl(null, {
        validators: [Validators.required]
      }),
      cgst: new FormControl(null, {
        validators: [Validators.required]
      }),
      sgst: new FormControl(null, {
        validators: [Validators.required]
      }),
      sellPrice: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('updatePriceId')) {
        this.mode = 'edit';
        this.updatePriceId = paramMap.get('updatePriceId');
        this.isLoading = true;
        this.updatePriceService.getProduct(this.updatePriceId)
        .subscribe(updatePriceData => {
          this.isLoading = false;
          this.updatePrice = {
            id: updatePriceData._id,
            number: updatePriceData.number,
            creator: updatePriceData.creator,
            cgst: updatePriceData.cgst,
            sgst: updatePriceData.sgst,
            description: updatePriceData.description,
            price: updatePriceData.price,
            sellPrice: updatePriceData.sellPrice
          };
          this.form.setValue({
            number: this.updatePrice.number,
            price: this.updatePrice.price,
            cgst: this.updatePrice.cgst,
            sgst: this.updatePrice.sgst,
            sellPrice: this.updatePrice.sellPrice || ''
          });
        });
      }
      else {
        this.mode = 'create';
        this.updatePriceId = null;
      }
    });
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }

  onUpdatePrice() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

      this.updatePriceService.updateProductPrice(
        this.updatePriceId,
        this.form.value.number,
        this.updatePrice.creator,
        this.form.value.sellPrice);


    this.form.reset();
  }

  // onImagePick(event: Event){
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({
  //     image: file
  //   });
  //   this.form.get('image').updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // }
}
