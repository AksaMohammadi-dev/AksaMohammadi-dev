import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VendorPurchaseOrderCreateComponent } from './vendor-purchase-order-create/vendor-purchase-order-create.component';
import { VendorPurchaseOrderListComponent } from './vendor-purchase-order-list/vendor-purchase-order-list.component';

@NgModule({
    declarations: [
        VendorPurchaseOrderCreateComponent,
        VendorPurchaseOrderListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ],
})
export class VendorPurchaseOrdersModule {}