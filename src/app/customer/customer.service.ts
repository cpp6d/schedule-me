import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Subject } from 'rxjs/Rx';
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CustomerService {

  constructor(private http: Http, private requestOptions: RequestOptions) { }
  
  user: any
  companyEmployees: any
  companySchedules: any
  companyAppointments: any
  companyId: any

  private token = localStorage.getItem('jwt-token');
  private authHeader = `Bearer ${this.token}`
  private headers = new Headers({ 'authorization': this.authHeader })

  private userSubject: Subject<any> = new Subject<any>()
  private employeesSubject: Subject<any> = new Subject<any>()

  getCustomerAppointments(userId): Observable<any> {
    let options = new RequestOptions({ headers: this.headers })

    return this.http.get(`/api/appointments/customer/${userId}`, options)
      .map((response: Response) => {
        return response.json()
      })
      .catch(this.handleError)
  }
  
  getCompanyById(companyId) {
    let options = new RequestOptions({ headers: this.headers })

    return this.http.get(`/api/companies/getonecompany/${companyId}`)
      .map((response: Response) => response.json())
      .catch(this.handleError)
  }

  getCompanies() {
    let options = new RequestOptions({ headers: this.headers })

    return this.http.get('/api/companies/getallcompanies')
      .map((response: Response) => {console.log(response); return response.json() })
      .catch(this.handleError)
  }

  getEmployees() {
    return this.employeesSubject.asObservable()
  }

  setEmployees(employees) {
    this.companyEmployees = employees
    this.employeesSubject.next(this.companyEmployees)
  }

  getUser() {
    return this.userSubject.asObservable()
  }

  setUser(user) {
    this.user = user
    this.userSubject.next(this.user)
  }

  getUserInformation(userId, email) {
    let params: URLSearchParams = new URLSearchParams()
    userId && params.set('userId', userId)
    email && params.set('email', email)

    let options = new RequestOptions({ 
      headers: this.headers,
      search: params 
    })

    return this.http.get('/api/users/', options)
      .map((response: Response) => {
        if(response.json().response.success){
          this.user = response.json().response.user
        }
        return response.json()
      })
      .catch(this.handleError)
  }

  submitUserUpdates(userId, updatedValues) {
    this.setUser(updatedValues)

    let options = new RequestOptions({
      headers: this.headers,
      body: updatedValues
    })
    return this.http.put(`/api/users/${userId}/update`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError)
  }

  
  getCompanySchedules(companyId): Observable<any> {
    let options = new RequestOptions({
      headers: this.headers
    })
    return this.http.get(`/api/users/employees/${companyId}`, options)
      .map((response: Response) => {
        let parsed = response.json().response
        if (!parsed.success) { // company not found
          return []
        } 
        this.setEmployees(parsed.employees)
        // this.companyEmployees = parsed.employees
        return this.companyEmployees.map((employee) => employee.UserCompany.id)
      })
      .flatMap((userCompanyIds) => {
        let userCompanyIdsString = JSON.stringify(userCompanyIds)
        return this.http.get(`/api/schedules/?userCompanyIds=${userCompanyIdsString}`, options)
          .map((response: Response) => {
            this.companySchedules = response.json()
            return this.companyEmployees, this.companySchedules
          })
      })
  }

  getCompanyAppointments(companyId): Observable<any> {
    let options = new RequestOptions({
      headers: this.headers
    })
    return this.http.get(`/api/appointments/company/${companyId}`, options)
      .map((response: Response) => {
        this.companyAppointments = response.json().response.appointments
        return this.companyAppointments
      })
  }

  handleError(err: Response) {
    return Observable.throw(err.json() || 'Server error')
  }
}
