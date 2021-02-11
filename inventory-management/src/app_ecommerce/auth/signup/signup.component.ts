import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ErrorComponent } from '../../error/error.component';
import { MatDialog } from '@angular/material';

@Component({
    styleUrls: ['./signup.component.css'],
    templateUrl: './signup.component.html',
})

export class SignupComponent implements OnInit, OnDestroy{
    isLoading = false;
    private authStatusSub: Subscription;
    constructor(public authService: AuthService, private flashMessage: FlashMessagesService, private dialog: MatDialog){}

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

    onSignup(form: NgForm){
        if(form.invalid){
            return;
        }
        let password = form.value.password;
        let confirmPassword = form.value.confirmPassword;

        if(password !== confirmPassword){
            this.dialog.open(ErrorComponent,  {data:{ message: "Password and Confirm Password did not match" }})
            return false;
          }

        this.isLoading = true;
        
        if(form.value.userType == "1"){
            this.authService.createCustomer(form.value.firstname, form.value.lastname, form.value.phone, form.value.email, form.value.password);  
        }
        else{
            this.authService.createEmployee(form.value.firstname, form.value.lastname, form.value.phone, form.value.email, form.value.password);  
        }
    }

}