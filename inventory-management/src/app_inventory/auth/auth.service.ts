import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private token: string;
    private isAuthenticated = false;
    private tokenTimer: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();
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

    createUser(firstname: string, lastname: string, phone:string, email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname,
            phone: phone
        };
        return this.http
        .post(BACKEND_URL + '/user/signup', authData)
        .subscribe(response => {
            this.router.navigate(['/']); 
        }, error => {
            this.authStatusListener.next(false);
        });
    }

    login(email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password,
            firstname: '',
            lastname: '',
            phone: ''
        };

        this.http.post<{token: string, expiresIn: number, userId: string;}>(BACKEND_URL + '/user/login', authData)
        .subscribe(response => {
            const token = response.token;
            this.token = token;
            if(token) {
                const expiresInDuration = response.expiresIn; 
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
                console.log(expirationDate);
                this.saveAuthData(token, expirationDate, this.userId);
                this.router.navigate(['/']);
            }
        }, error => {
            this.authStatusListener.next(false);
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
            this.authStatusListener.next(true);
        }
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
        this.clearAuthData();
        this.userId = null;
        clearTimeout(this.tokenTimer);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private setAuthTimer(duration: number){
        console.log("setting timer: " + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        if(!token || !expirationDate){
            return;
        }
        return {
            token: token,
            userId: userId,
            expirationDate: new Date(expirationDate)
        }
    }
}