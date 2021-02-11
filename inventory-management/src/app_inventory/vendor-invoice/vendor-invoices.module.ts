import { NgModule } from '@angular/core';
import { VendorInvoiceCreateComponent } from './vendor-invoice-create/vendor-invoice-create.component';
import { VendorInvoiceListComponent } from './vendor-invoice-list/vendor-invoice-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        VendorInvoiceCreateComponent,
        VendorInvoiceListComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule,
        FormsModule
    ],
})
export class VendorInvoicesModule {}