import { Injectable, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CompanyService {

  /* COMPANY PROFILE COMPONENT */
  company: any = {}

  getCompanyById(companyId) {
    return this.http.get('api/companies/getonecompany/' + companyId)
    .map((response: Response) => {
      let data = response.json()
      console.log(data, '***IS THIS WHERE THE ERROR IS')
      //console.log(data.BrandName.name, 'SHOULD NOT BE HERE')
      this.company.BrandNameId = data.BrandNameId || null;
      this.company.brandName = data.BrandName.name
      this.company.address = data.address || null;
      this.company.createdAt = data.createdAt || null;
      this.company.description = data.description || null;
      this.company.id = data.id || null;
      this.company.image = data.image || null;
      this.company.logo = data.logo || null;
      this.company.name = data.name || null;
      this.company.phoneNumber = data.phoneNumber || null;
      this.company.updatedAt = data.updatedAt || null;
      this.company.website = data.website || null;
      console.log(this.company, 'COMPANYSERVICE = POPULATED COMPANY')
      return response.json()
    })
  }

  brandNamesAll: any = [];

  getAllBrandNames() {
    return this.http.get('api/companies/getallbrandnames')
    .map((response:Response) => {
      let brandNamesReturned = response.json()
      brandNamesReturned.forEach((data) => {
      let brandName = {
        id: data.id,
        name: data.name,
        companyId: data.companyId
      }
      this.brandNamesAll.push(brandName)
      })
      console.log(this.brandNamesAll, 'after being populated')
      return response.json()
      })
  }

  updateProfile(body) {
    return this.http.put('api/companies/updatecompany', body)
  }
  /* COMPANY PROFILE COMPONENT END */
  

  constructor(private http: Http) { }
  postOneEmployeeSched(employeeSched) {
    return this.http.post('/api/schedules/oneschedule', employeeSched)
  }
  
  getEmployees(companyId) {
    return this.http.get('/api/users/getemployees/' + companyId)
    .map((response:Response) => {
      console.log(response, 'dis **** response');
      let data = response.json()
      return data[0].users
    })
  }

  getUsersFromCompany(companyId) {
    return this.http.get('/api/users/employees?companyId=' + companyId)
    .map((response: Response) => response.json().response.employees)
  }

  deleteEmployee(body) {
    return this.http.delete('api/users/employees?userId=' + body.userId + '&' + 'companyId=' + body.companyId)
    .map((response:Response) => response)
  }

  addEmployee(body: any): Observable<any> {
    // const headers = new Headers('Content-Type', 'Application/json');
    return this.http.put('/api/users/employees', body)
    .map((response:Response) => response)
    //.catch(err => return err)
  }

  /*  COMPANY MODEL */

  getUsers(input) {
    if (1 + input > 1) {
      console.log('number', input)
      return this.http.get('api/users/?userId=' + input + '&email=')
      .map((response: Response) => response.json())
    } else if (typeof input === 'string') {
      console.log('string', input)
      return this.http.get('api/users/?userId=&email=' + input)
      .map((response:Response) => response.json())
    }
  }
  //getAllBrandNames

  postBrandName(body) {
    return this.http.post('/api/companies/postbrandname', body)
    .map((response:Response) => {
      //this.getAllBrandNames()
      return response.json()
    })
  }  
  //options
  addOptions (body:any): Observable<any>{
    return this.http.post('api/companies/postoneoption',body)
    .map((response:Response) => response)
  }

  getOptions (body:any): Observable<any>{
    return this.http.get('api/companies/getalloptions/'+body)
    .map((response:Response) => response.json())
  }
  

}
