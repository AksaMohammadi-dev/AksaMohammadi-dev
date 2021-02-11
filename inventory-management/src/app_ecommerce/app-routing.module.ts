import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { ClientCreateComponent } from './clients/client-create/client-create.component';
import { ActivateEmployeesComponent } from './activateEmployees/activate-employees.component';
import { UpdatePriceListComponent } from './update-price/update-price-list/update-price-list.component';
import { UpdatePriceCreateComponent } from './update-price/update-price-create/update-price-create.component';


const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'list-client', component: ClientListComponent, canActivate: [AuthGuard] },
  { path: 'create-client', component: ClientCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit-client/:clientId', component: ClientCreateComponent, canActivate: [AuthGuard] },

  { path: 'list-update-price', component: UpdatePriceListComponent, canActivate: [AuthGuard] },
  { path: 'create-update-price', component: UpdatePriceCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit-update-price/:updatePriceId', component: UpdatePriceCreateComponent, canActivate: [AuthGuard] },

  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

  { path: 'activate-employees', component: ActivateEmployeesComponent, canActivate: [AuthGuard] },
];
//'./auth/auth.module#AuthModule'
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
