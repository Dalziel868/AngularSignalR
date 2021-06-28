import { Component, ElementRef, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit,OnDestroy {

  @ViewChildren(FormControlName,{read:ElementRef})
  formInputElements!:ElementRef[];
  pageTitle = 'Employee Edit';
  errorMessage='';
  employeeForm!:FormGroup;
  traneMode?:string;
  employee!:Employee;
  private sub!:Subscription;

  displayMessage:{[key:string]:string}={};
  private validateMessages!:{[key:string]:{[key:string]:string}};
  constructor(private fb:FormBuilder,private route:ActivatedRoute,private router:Router, private empService:EmployeeService)
   {

    this.validateMessages={
      name:{
        required:'Employee is required',
        minlength:'Employee name must be at least three characters.',
        maxlength:'Employee name cannot exceed 50 characters.'
      },
      cityname:{
        required: 'Employee city name is required.',
      }
    }
   }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.traneMode='new';
    this.employeeForm=this.fb.group({
        name:['',[Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
        address:'',
        cityname:['',[Validators.required]],
        gender:'',
        company:'',
        designation:'',
    });
    this.sub=this.route.paramMap.subscribe(
      params=>{
        const id=params.get('id')!.toString();
        const cityname=params.get('cityname');
        if(id==='0')
        {
          const employee: Employee = { id: "0", name: "", address: "", gender: "", company: "", designation: "", cityname: "" };
          this.displayEmployee(employee);

        }
        else{
          this.getEmployee(id);
        }
      }
    );
  }
  getEmployee(id:string):void
  {
      this.empService.getEmployee(id).subscribe((data)=>{
          this.displayEmployee(data);
      },
      (err)=>{this.errorMessage=<any>err});
  }
  displayEmployee(emp:Employee):void
  {
    if(this.employeeForm)
    {
      this.employeeForm.reset();
    }
    this.employee=emp;
    if(this.employee.id=='0')
    {
      this.pageTitle='Add Employee';
    }
    else{
      this.pageTitle=`Edit employee: ${this.employee.name}`;
    }
    this.employeeForm.patchValue({
        name:this.employee.name,
        address:this.employee.address,
        cityname:this.employee.cityname,
        gender:this.employee.gender,
        company:this.employee.company,
        designation:this.employee.designation,
    });
  }

  deleteEmployee():void
  {
      if(this.employee.id=='0')
      {
        this.onSaveComplete();
      }
      else
      {
        if(confirm(`Are you sure to delete this Employee: ${this.employee.name}?`)){
          this.empService.deleteEmployee(this.employee.id).subscribe(
            ()=>this.onSaveComplete(),
            (err:any)=>this.errorMessage=<any>err
          );
        }
      }
  }
  saveEmployee():void
  {
      if(this.employeeForm.valid)
      {
        if(this.employeeForm.dirty)
        {
          const p={...this.employee,...this.employeeForm.value};
          if(p.id==='0')
          {
              this.empService.createEmployee(p)
              .subscribe(()=>this.onSaveComplete,(err:any)=>this.errorMessage=<any>err);
          }
          else
          {
            this.empService.updateEmployee(p.id,p)
            .subscribe(()=>this.onSaveComplete(),(err:any)=>this.errorMessage=<any>err);
          }
        }
        else{
          this.onSaveComplete();
        }
      }
      else{
        this.errorMessage='Please correct the validation errors.';
      }
  }

  onSaveComplete():void
  {
      this.employeeForm.reset();
      this.router.navigate(['/employees']);
  }

}
