import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  pageTitle = 'Employee List';
  filteredEmployees:Employee[]=[];
  employees:Employee[]=[];
  errorMessage='';
  private _listFilter = '';
  public get listFilter():string {
    return this._listFilter;
  }
  public set listFilter(value:string) {
    this._listFilter = value;
    this.filteredEmployees=this.listFilter?this.performFilter(this.listFilter):this.employees;
  }




  performFilter(filterBy: string):Employee[]
  {
      filterBy=filterBy.toLocaleLowerCase();
      return this.employees.filter((value:Employee)=>{
          value.name.toLocaleLowerCase().indexOf(filterBy)!==-1
      });
  }
  constructor(private empService:EmployeeService) { }

  ngOnInit(): void {
    this.getEmployeeData();
    const connection=new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl(environment.baseUrl+'notify')
    .build();
    connection.start().then(()=>{
      console.log('SignalR connected!');
    }).catch((err)=>console.error(err));

    connection.on('BroadCastMessage',()=>this.getEmployeeData());
  }

  getEmployeeData()
  {
    return this.empService.getAllEmployees().subscribe(employees=>{
      this.employees=employees;
      this.filteredEmployees=this.employees;
    },
    error=>this.errorMessage=<any>error
    );
  }
  deleteEmployee(id:string,name:string):void
  {
    if(id==='')
    {
      this.onSaveComplete();
    }
    else
    {
      if(confirm(`Are you sure to delete Employee: ${name}?`))
      {
        this.empService.deleteEmployee(id).subscribe(()=>this.onSaveComplete(),
        (err:any)=>this.errorMessage=<any>err);
      }
    }
  }

  onSaveComplete():void
  {
      this.empService.getAllEmployees().subscribe(emp=>{
          this.employees=emp;
          this.filteredEmployees=this.employees;
      },error=>this.errorMessage=<any>error
      );
  }
}
