import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
  userIsAuthenticated = false;
  userIsAdmin = false;
  userIsEmployee = false;
  private authListenerSub: Subscription;

  constructor(private authService: AuthService){ }

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userIsAdmin = this.authService.getIsAdmin();
    this.userIsEmployee = this.authService.getIsEmployee();
    this.authListenerSub = this.authService
    .getAuthStatusListener()
    .subscribe(authenticated => {
      this.userIsAuthenticated = authenticated.isUserAuth;
      this.userIsAdmin = authenticated.isAdmin;
      this.userIsEmployee = authenticated.isEmployee;
    });
  }

  ngOnDestroy(){
    this.authListenerSub.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }
}
