import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/Rx'
import 'rxjs/add/operator/map';
import { Subject, BehaviorSubject} from 'rxjs/Rx'
// import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/forkJoin';

@Injectable()
export class EmployeeServiceService {
  companyId: number
  subject: BehaviorSubject<number> = new BehaviorSubject<number>(this.companyId)
  nameSubject: Subject<any> = new Subject<any>()
  companyName: any
  constructor(private http: Http) { }

  getUserCompanies(id: any): Promise<any>{
    return this.http.get(`/api/companies/usercompanies/${id}`)
    .toPromise()
    .then(response=>{
        return response.json()
    })
  }

  updateBlock(body: Object): Promise<any> {
    return this.http.put('/api/schedules', body)
    .toPromise()
    .then(response => response.json())
  }
  
  makeAppointment(body: Object): Promise<any> {
    return this.http.post('/api/appointments', body)
      .toPromise()
      .then(response => response.json())
  }

  getEmployees(id: Number): Observable<any> {
    return this.http.get(`api/users/getemployees/${id}`)
      .map((response: Response) => response)
  }

  getSchedule(body: any): Promise<any>{
    let id = JSON.stringify(body)
    return this.http.get(`/api/schedules/?userCompanyIds=${id}`)
    .toPromise()
    .then(response => response.json())
  }


  getEmployeeCalendarData(userId, userCompanyIds): Observable<any> {
    console.log('asdfasdf', userCompanyIds)
    const employeeAppointmentsUrl = `/api/appointments/${userId}`

    let token = localStorage.getItem('jwt-token');
    let authHeader = `Bearer ${token}`
    let headers = new Headers({ 'authorization': authHeader })

    let params: URLSearchParams = new URLSearchParams()
    params.set('userCompanyIds', JSON.stringify(userCompanyIds))
    
    let optionsForSchedules = new RequestOptions({ 
      headers: headers,
      search: params
    })
    let optionsForAppointments = new RequestOptions({
      headers: headers
    })
    
    return Observable.forkJoin(
      this.http.get('/api/schedules/', optionsForSchedules)
        .map((response: Response) => {
          return response.json()
        })
        .catch(this.handleError),
      this.http.get(`/api/appointments/${userId}`, optionsForAppointments)
        .map((response: Response) => {
          return response.json()
        })
        .catch(this.handleError)
    )
  }
  
  getCompanyId() {
    return this.subject.asObservable()
  }
  getCompanyName(){
    return this.nameSubject.asObservable()
  }

  setCompanyId(companyId: number) {
    this.companyId = companyId
    this.subject.next(this.companyId)
  }

  setCompanyName(companyName: any) {
    this.companyName = companyName
    this.nameSubject.next(this.companyName)
  }

  handleError(err: Response) {
    return Observable.throw(err.json() || 'Server error')
  }

}
