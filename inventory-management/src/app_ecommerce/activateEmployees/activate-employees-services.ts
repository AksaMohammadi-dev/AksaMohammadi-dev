
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";
import { ActivateEmployee } from './activate-employee.model';

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class ActivateEmployeesService{

  constructor(private http: HttpClient, private router: Router){

  }

  getAllNonActiveEmployee(){
    
    return this.http.get<{message: string, employees: ActivateEmployee[]}>(
      BACKEND_URL + '/employee/getAllNonActiveEmployee'
    )
  }

  updateActiveEmployees(empIds: string[]){
    const activeEmpData = {
      empIds: empIds
    }

    this.http
      .post<{ message: string }>(BACKEND_URL + '/employee/updateActiveEmployee', activeEmpData)
      .subscribe(responseData => {
        this.router.navigate(['']);
      });
  }

}
