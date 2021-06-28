import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from './employee';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl=environment.baseUrl+"api/employees";

  constructor(private http:HttpClient) { }


  private HandleError(err:any)
  {
    let errorMess:string;
    if(err.error instanceof ErrorEvent)
    {
      errorMess=`An error occurred ${err.error.message}`;
    }
    else
    {
      errorMess = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMess);
  }
  private InitEmployee():Employee
  {
    return {
      id:'',
      name:'',
      designation:'',
      company:'',
      cityname:'',
      address:'',
      gender:''

    };
  }

  getAllEmployees():Observable<Employee[]>
  {
      return this.http.get<Employee[]>(this.baseUrl)
      .pipe(
        catchError(this.HandleError)
      );
  }
  getEmployee(id:string):Observable<Employee>
  {
    if(id==='')
    {
      return of(this.InitEmployee());
    }
    const url=`${this.baseUrl}/${id}`;
    return this.http.get<Employee>(url)
    .pipe(catchError(this.HandleError));
  }

  createEmployee(emp:Employee):Observable<Employee>
  {
    const headers=new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<Employee>(this.baseUrl,emp,{headers:headers})
    .pipe(catchError(this.HandleError));
  }

  deleteEmployee(id:string):Observable<{}>
  {
    const header=new HttpHeaders({'Content-Type':'application/json'});
    const url=`${this.baseUrl}/${id}`;
    return this.http.delete<Employee>(url,{headers:header})
    .pipe(catchError(this.HandleError));
  }
  updateEmployee(id:string,emp:Employee):Observable<Employee>
  {
      const url=`${this.baseUrl}/${id}`;
      const header=new HttpHeaders({'Content-Type':'application/json'});
      return this.http.put<Employee>(url,emp,{headers:header})
      .pipe(
          map(()=>emp),
          catchError(this.HandleError)
      );

  }
}
