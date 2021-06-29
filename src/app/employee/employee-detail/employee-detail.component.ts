
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  pageTitle = 'Employee Detail';
  errorMessage = '';
  employee: Employee | undefined;
  constructor(private empService:EmployeeService,private route:ActivatedRoute,
     private router:Router) { }

  getEmployee(id:string):void
  {
    this.empService.getEmployee(id).subscribe(e=>this.employee=e,(err:any)=>this.errorMessage=<any>err);
  }
  ngOnInit(): void {
    const id=this.route.snapshot.paramMap.get('id');
    if(id)
    {
      this.getEmployee(id);
    }
  }
  onBack():void
  {
    this.router.navigate(['/employees']);
  }

}
