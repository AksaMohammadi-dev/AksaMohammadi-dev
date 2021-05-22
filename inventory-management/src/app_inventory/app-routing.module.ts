import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductCreateComponent } from './products/product-create/product-create.component';
import { VendorListComponent } from './vendors/vendor-list/vendor-list.component';
import { VendorCreateComponent } from './vendors/vendor-create/vendor-create.component';
import { VendorInvoiceListComponent } from './vendor-invoice/vendor-invoice-list/vendor-invoice-list.component';
import { VendorInvoiceCreateComponent } from './vendor-invoice/vendor-invoice-create/vendor-invoice-create.component';
import { HomeComponent } from './home/home.component';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { ClientCreateComponent } from './clients/client-create/client-create.component';
import { CategoryCreateComponent } from './category/category-create/category-create.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { VendorPurchaseOrderListComponent } from './vendor-purchase-order/vendor-purchase-order-list/vendor-purchase-order-list.component';
import { VendorPurchaseOrderCreateComponent } from './vendor-purchase-order/vendor-purchase-order-create/vendor-purchase-order-create.component';
import { VendorPaymentManagementListComponent } from './vendor-payment-management/vendor-payment-management-list/vendor-payment-management-list.component';
import { VendorPaymentManagementCreateComponent } from './vendor-payment-management/vendor-payment-management-create/vendor-payment-management-create.component';
import { StockListComponent } from './stock/stock-list/stock-list.component';
import { StockCreateComponent } from './stock/stock-create/stock-create.component';
import { CreateClientPurchaseOrderComponent } from './client-purchase-order/create-client-purchase-order/create-client-purchase-order.component';
import { ListClientPurchaseOrderComponent } from './client-purchase-order/list-client-purchase-order/list-client-purchase-order.component';
import { EditClientPurchaseOrderComponent } from './client-purchase-order/edit-client-purchase-order/edit-client-purchase-order.component';
import { ClientPaymentManagementComponent } from './client-purchase-order/client-payment-management/client-payment-management.component';
import { ReportsComponent } from './reports/reports/reports.component';
import { ClientPaymentComponent } from './client-purchase-order/client-payment/client-payment.component';


const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'list-product', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'create-product', component: ProductCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit-product/:productId', component: ProductCreateComponent, canActivate: [AuthGuard] },

  { path: 'list-vendor', component: VendorListComponent, canActivate: [AuthGuard] },
  { path: 'create-vendor', component: VendorCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit-vendor/:vendorId', component: VendorCreateComponent, canActivate: [AuthGuard] },

  { path: 'list-stock', component: StockListComponent, canActivate: [AuthGuard] },
  { path: 'get-stock-records/:stockId', component: StockCreateComponent, canActivate: [AuthGuard] },


  { path: 'list-client', component: ClientListComponent, canActivate: [AuthGuard] },
  { path: 'create-client', component: ClientCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit-client/:clientId', component: ClientCreateComponent, canActivate: [AuthGuard] },

  { path: 'list-vendor-invoice', component: VendorInvoiceListComponent, canActivate: [AuthGuard] },
  { path: 'edit-vendor-invoice/:vendorInvoiceId', component: VendorInvoiceCreateComponent, canActivate: [AuthGuard] },

  { path: 'list-category', component: CategoryListComponent, canActivate: [AuthGuard] },
  { path: 'create-category', component: CategoryCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit-category/:categoryId', component: CategoryCreateComponent, canActivate: [AuthGuard] },

  { path: 'list-vendor-purchase-order', component: VendorPurchaseOrderListComponent, canActivate: [AuthGuard] },
  { path: 'create-vendor-purchase-order', component: VendorPurchaseOrderCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit-vendor-purchase-order/:vendorPurchaseOrderId', component: VendorPurchaseOrderCreateComponent, canActivate: [AuthGuard] },

  { path: 'client-purchase-order', component: CreateClientPurchaseOrderComponent, canActivate: [AuthGuard] },
  { path: 'list-client-purchase-order', component: ListClientPurchaseOrderComponent, canActivate: [AuthGuard] },
  { path: 'edit-client-purchase-order/:PO_id', component: EditClientPurchaseOrderComponent, canActivate: [AuthGuard] },
  { path: 'client-payment-management/invoice', component: ClientPaymentManagementComponent, canActivate: [AuthGuard] },
  { path: 'client-payment-management/payment', component: ClientPaymentComponent, canActivate: [AuthGuard] },
  { path: 'list-vendor-payment-management', component: VendorPaymentManagementListComponent, canActivate: [AuthGuard] },
  { path: 'create-vendor-payment-management', component: VendorPaymentManagementCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit-vendor-payment-management/:vendorPaymentManagementId', component: VendorPaymentManagementCreateComponent, canActivate: [AuthGuard] },

  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },

  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
];
//'./auth/auth.module#AuthModule'
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
