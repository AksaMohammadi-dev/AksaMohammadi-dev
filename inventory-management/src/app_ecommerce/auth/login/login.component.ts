import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit, OnDestroy{
    isLoading = false;
    private authStatusSub: Subscription;

    constructor(public authService: AuthService) {
    }

    ngOnInit(){
        this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
    }

    ngOnDestroy(){
        this.authStatusSub.unsubscribe();
    }

    onLogin(form: NgForm){
       if(form.invalid){
           return;
       }
       this.isLoading = true;

       if(form.value.userType == "1"){
        this.authService.loginCustomer(form.value.email, form.value.password);
       }
       else{
        this.authService.loginEmployee(form.value.email, form.value.password);
       }
    }

}