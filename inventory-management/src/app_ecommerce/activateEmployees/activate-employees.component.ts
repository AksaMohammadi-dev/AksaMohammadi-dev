import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivateEmployeesService } from './activate-employees-services';
import { ActivateEmployee } from './activate-employee.model';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-activate-employees',
  templateUrl: './activate-employees.component.html',
  styleUrls: ['./activate-employees.component.css']
})

export class ActivateEmployeesComponent implements OnInit, OnDestroy{

  public employees: ActivateEmployee[] = [];
  public displayedColumns: string[];

  constructor(private activateEmployeesService: ActivateEmployeesService){ }

  ngOnInit(){
    
    this.activateEmployeesService.getAllNonActiveEmployee()
    .subscribe(data => {
      console.log(data)
      
      _.forEach(data.employees, (emp) => {
        let employeeData = {} as ActivateEmployee;
        employeeData.isSelected = false;
        employeeData.email = emp.email;
        employeeData.firstname = emp.firstname;
        employeeData.lastname = emp.lastname;
        employeeData.id = emp._id;
        employeeData.phone = emp.phone;

        this.employees.push(employeeData);
      });
      
      //this.employees = data.employees;

      this.displayedColumns = ['isSelected','firstname', 'lastname', 'phone', 'email'];
      
    });

  }

  selectRow(employee: ActivateEmployee){
    
    let selectedEmp = _.find(this.employees, function(emp) {
      return emp.id == employee.id
    })
    selectedEmp.isSelected = employee.isSelected
  }

  saveActivatedEmployees(){
    let empIds: string[] = [];

    _.forEach(this.employees, (emp) => {
      if(emp.isSelected)
        empIds.push(emp.id);
    });

    this.activateEmployeesService.updateActiveEmployees(empIds);
  }

  ngOnDestroy(){
    
  }
}
