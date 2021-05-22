import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';

import { ErrorComponent } from './error/error.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { ProductsModule } from './products/products.module';
import { VendorsModule } from './vendors/vendors.module';
import { ClientsModule } from './clients/clients.module';
import { VendorInvoicesModule } from './vendor-invoice/vendor-invoices.module';
import { ErrorInterceptor } from './products/error-interceptor';
import { HomeComponent } from './home/home.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { CategorysModule } from './category/category.module';
import { VendorPurchaseOrdersModule } from './vendor-purchase-order/vendor-purchase-orders.module';
import { VendorPaymentManagementModule } from './vendor-payment-management/vendor-payment-management.module';
import { SuccessMessageComponent } from './success-message/success-message.component';
import { StockListComponent } from './stock/stock-list/stock-list.component';
import { StockCreateComponent } from './stock/stock-create/stock-create.component';
import { MatCheckboxModule } from '@angular/material';
import { CreateClientPurchaseOrderComponent } from './client-purchase-order/create-client-purchase-order/create-client-purchase-order.component';
import { ListClientPurchaseOrderComponent } from './client-purchase-order/list-client-purchase-order/list-client-purchase-order.component';
import { EditClientPurchaseOrderComponent } from './client-purchase-order/edit-client-purchase-order/edit-client-purchase-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientPaymentManagementComponent } from './client-purchase-order/client-payment-management/client-payment-management.component';
import { ReportsComponent } from './reports/reports/reports.component';
import { ClientPaymentComponent } from './client-purchase-order/client-payment/client-payment.component';
import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    HomeComponent,
    SuccessMessageComponent,
    StockListComponent,
    StockCreateComponent,
    CreateClientPurchaseOrderComponent,
    ListClientPurchaseOrderComponent,
    EditClientPurchaseOrderComponent,
    ClientPaymentManagementComponent,
    ReportsComponent,
    ClientPaymentComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatTableExporterModule,
    BrowserModule,
    MatCheckboxModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    ProductsModule,
    VendorsModule,
    ClientsModule,
    VendorInvoicesModule,
    CategorysModule,
    VendorPurchaseOrdersModule,
    VendorPaymentManagementModule,
    FlashMessagesModule.forRoot(),
  ],
  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent,SuccessMessageComponent]
})
export class AppModule { }
