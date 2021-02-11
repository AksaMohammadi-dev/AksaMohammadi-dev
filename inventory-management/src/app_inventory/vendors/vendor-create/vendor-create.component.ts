import { Component, Output, OnInit, OnDestroy } from '@angular/core';
import { VendorService } from '../vendor-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Vendor } from '../vendor.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app_inventory/auth/auth.service';

@Component({
  selector: 'app-vendor-create',
  templateUrl: './vendor-create.component.html',
  styleUrls: ['./vendor-create.component.css']
})
export class VendorCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private vendorId: string;
  isLoading = false;
  form: FormGroup;
  vendor: Vendor;
  imagePreview: string;
  private authStatusSubs: Subscription;

  constructor(public vendorService: VendorService, public authService: AuthService, public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.authStatusSubs = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('vendorId')) {
        this.mode = 'edit';
        this.vendorId = paramMap.get('vendorId');
        this.isLoading = true;
        this.vendorService.getVendor(this.vendorId)
        .subscribe(vendorData => {
          this.isLoading = false;
          this.vendor = {
            id: vendorData._id,
            name: vendorData.name,
            creator: vendorData.creator,
          };
          this.form.setValue({
            name: this.vendor.name,
          });
        });
      }
      else {
        this.mode = 'create';
        this.vendorId = null;
      }
    });
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }

  onSaveVendor() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {

      this.vendorService.addVendor(
        this.form.value.name,
        this.form.value.creator);
    }
    else {

      this.vendorService.updateVendor(
        this.vendorId,
        this.form.value.name,
        this.form.value.creator);
    }


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
