import { Component, Output, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from '../category-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Category } from '../category.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private categoryId: string;
  categoriesLst: [];
  isLoading = false;
  selectedParentCategory: string;
  form: FormGroup;
  category: Category;
  imagePreview: string;
  private authStatusSubs: Subscription;

  constructor(public categoryService: CategoryService, public authService: AuthService, public route: ActivatedRoute) {

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

    this.categoryService.getMetaData()
    .subscribe(metaDataRes => {
      
      this.categoriesLst = metaDataRes.categories;

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('categoryId')) {
          this.mode = 'edit';
          this.categoryId = paramMap.get('categoryId');
          this.isLoading = true;
          this.categoryService.getCategory(this.categoryId)
          .subscribe(categoryData => {
            this.isLoading = false;
            this.selectedParentCategory = categoryData.parentCategory;
            this.category = {
              id: categoryData._id,
              name: categoryData.name,
              creator: categoryData.creator,
              parentCategory: categoryData.parentCategory
            };
            this.form.setValue({
              name: this.category.name,
              parentCategory: this.category.parentCategory
            });
          });
        }
        else {
          this.mode = 'create';
          this.categoryId = null;
        }
      });

    })
    
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }

  onSaveCategory() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {

      this.categoryService.addCategory(
        this.form.value.name,
        this.form.value.creator, 
        this.selectedParentCategory);
    }
    else {

      this.categoryService.updateCategory(
        this.categoryId,
        this.form.value.name,
        this.form.value.creator, 
        this.selectedParentCategory);
    }


    this.form.reset();
  }

  selectedValue(event: MatSelectChange) {
    this.selectedParentCategory = event.value;
  }
}
