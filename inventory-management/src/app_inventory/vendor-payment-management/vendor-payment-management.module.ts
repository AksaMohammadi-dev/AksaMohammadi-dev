import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VendorPaymentManagementCreateComponent } from './vendor-payment-management-create/vendor-payment-management-create.component';
import { VendorPaymentManagementListComponent } from './vendor-payment-management-list/vendor-payment-management-list.component';

@NgModule({
    declarations: [
        VendorPaymentManagementCreateComponent,
        VendorPaymentManagementListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ],
})
export class VendorPaymentManagementModule {}