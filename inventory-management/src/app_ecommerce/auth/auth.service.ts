import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { SessionData } from './auth-session.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

class AuthenticationData{

}

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private token: string;
    private isAuthenticated = false;
    private tokenTimer: any;
    private userId: string;
    private isAdmin: boolean;
    private isEmployee: boolean;
    private authStatusListener = new Subject<any>();
    constructor(private http: HttpClient, private router: Router) {

    }

    getToken(){
        return this.token;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    getUserId(){
        return this.userId;
    }

    getIsAdmin(){
        return this.isAdmin;
    }

    getIsEmployee(){
        return this.isEmployee;
    }

    createCustomer(firstname: string, lastname: string, phone:string, email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
        };
        return this.http
        .post(BACKEND_URL + '/customer/signup', authData)
        .subscribe(response => {
            this.router.navigate(['/']); 
        }, error => {
            this.authStatusListener.next({
                isEmployee: false,
                isAdmin: false,
                isUserAuth: false
            });
        });
    }

    createEmployee(firstname: string, lastname: string, phone:string, email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
        };
        return this.http
        .post(BACKEND_URL + '/employee/signup', authData)
        .subscribe(response => {
            this.router.navigate(['/']); 
        }, error => {
            this.authStatusListener.next({
                isEmployee: false,
                isAdmin: false,
                isUserAuth: false
            });
        });
    }

    loginEmployee(email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password,
            firstname: '',
            lastname: '',
            phone: ''
        };

        this.http.post<{token: string, expiresIn: number, employeeId: string; isAdmin: boolean;}>(BACKEND_URL + '/employee/login', authData)
        .subscribe(response => {
            const token = response.token;
            this.token = token;
            if(token) {
                const expiresInDuration = response.expiresIn; 
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.userId = response.employeeId;
                this.isAdmin = response.isAdmin;
                this.isEmployee = true;
                this.authStatusListener.next({
                    isEmployee: true,
                    isAdmin: response.isAdmin,
                    isUserAuth: true
                });
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
                console.log(expirationDate);
                this.saveAuthData(token, expirationDate, this.userId, this.isAdmin, this.isEmployee);
                this.router.navigate(['/']);
            }
        }, error => {
            this.authStatusListener.next({
                isEmployee: false,
                isAdmin: false,
                isUserAuth: false
            });
        });
    }

    loginCustomer(email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password,
            firstname: '',
            lastname: '',
            phone: ''
        };

        this.http.post<{token: string, expiresIn: number, customerId: string;}>(BACKEND_URL + '/customer/login', authData)
        .subscribe(response => {
            const token = response.token;
            this.token = token;
            if(token) {
                const expiresInDuration = response.expiresIn; 
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.userId = response.customerId;
                this.authStatusListener.next({
                    isEmployee: false,
                    isAdmin: false,
                    isUserAuth: true
                });
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
                console.log(expirationDate);
                this.saveAuthData(token, expirationDate, this.userId, false, false);
                this.router.navigate(['/']);
            }
        }, error => {
            this.authStatusListener.next({
                isEmployee: false,
                isAdmin: false,
                isUserAuth: false
            });
        });
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn/1000);
            this.userId = authInformation.userId;
            this.isAdmin = (authInformation.isAdmin =="true");
            this.isEmployee = (authInformation.isEmployee =="true");
            this.authStatusListener.next({
                isEmployee: false,
                isAdmin: false,
                isUserAuth: false
            });
        }
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next({
            isEmployee: false,
            isAdmin: false,
            isUserAuth: false
        });
        this.router.navigate(['/']);
        this.clearAuthData();
        this.userId = null;
        clearTimeout(this.tokenTimer);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string, isAdmin: boolean, isEmployee: boolean) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('isAdmin', String(isAdmin));
        localStorage.setItem('isEmployee', String(isEmployee));
    }

    private setAuthTimer(duration: number){
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isEmployee');
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        const isAdmin = localStorage.getItem("isAdmin");
        const isEmployee = localStorage.getItem("isEmployee");
        if(!token || !expirationDate){
            return;
        }
        return {
            token: token,
            userId: userId,
            expirationDate: new Date(expirationDate),
            isEmployee: isEmployee,
            isAdmin: isAdmin
        }
    }
}