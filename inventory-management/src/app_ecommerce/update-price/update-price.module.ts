import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpdatePriceCreateComponent } from './update-price-create/update-price-create.component';
import { UpdatePriceListComponent } from './update-price-list/update-price-list.component';

@NgModule({
    declarations: [
        UpdatePriceCreateComponent,
        UpdatePriceListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ],
})
export class UpdatePriceModule {}