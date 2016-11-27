import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import * as moment from 'moment'

import {SelectItem} from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx'
import { EmployeeServiceService } from '../employee-service.service'
import { AuthService } from '../../auth/auth.service'
import { CompanyService } from '../../company/company.service'
declare var swal: any;


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
    date : Date ; 
    user: any;
    employees: SelectItem[];
    hours: SelectItem[];
    services: SelectItem[];
    allschedule: SelectItem[];
    public available;
    start;
    times;
    open;
    service: {};
    temp;
    scheduleStorage = [];
    companyId
    companyIdSubscription: Subscription

    person = {
      contactName: undefined,
      contactNumber: undefined,
      description: undefined,
      startTime: undefined,
      endTime: undefined,
      customerId :undefined,
      employeeId : undefined,
      companyId : undefined
    }
    
  // @Output() clicked = new EventEmitter<string>();
  @Output() newAppointment = new EventEmitter<any>()

  ngOnInit() {
    this.companyIdSubscription = this.employeeServiceService.getCompanyId()
      .subscribe(
        (companyId) => {
          this.companyId = companyId
          this.person.companyId = this.companyId

          this.employeeServiceService.getEmployees(this.companyId)
            .subscribe(
              employee => {
                this.employees = employee.json()[0].users
              }
            )
          this.companyService.getOptions(this.companyId)
            .subscribe(options => {
              this.services = options
            })
          }
      )
  }

  getTime(employeeServiceService:EmployeeServiceService){
    this.scheduleStorage = []
    this.temp = undefined
    let arr= []
    let arr2= []
    let current = []
    if(this.person.employeeId === undefined || this.person.description === undefined){
      // alert('Please select all fields')
      swal("Oops...", "Please select all fields!", "error")
    }else{
      this.employees.forEach(curr=>{
        arr.push(curr)
      })
      arr.forEach(curr=>{
        arr2.push(curr.id)
      })

      this.employeeServiceService.getSchedule(arr2)
      .then(
        schedule => { 
          this.available = schedule
          this.available.forEach(curr=>{
            current.push(curr)
          })
          current.forEach(curr=>{
            if(curr.UserCompanyId === this.person.employeeId.UserCompany.id && moment(curr.startTime).isSame(this.start,'day')){
              this.available = JSON.parse(curr.block)
              this.temp = curr
            }
          })
          if(this.temp === undefined){
            swal("Please select another day!", "They're not currently schedule to work", "error")
          }else{
            for(var i = 0; i <this.available.length-(this.person.description[0].duration)/15; i++){
              let conflict = false;
              for(let j = 0; j < ((this.person.description[0].duration)/15); j++){
                if(this.available[i+j].label === "Not available"){
                  conflict = true;
                }
              }
              if(!conflict){
                this.scheduleStorage.push(this.available[i])
              }
            }
          }
        }
      )
    }
  }

  editBlock(){
      let remove = this.available.indexOf(this.open[0])
      for(var i = remove; i< remove+(this.person.description[0].duration)/15; i++){
        this.available[i].label = "Not available"
      }
      
      this.temp.block = JSON.stringify(this.available)

      this.employeeServiceService.updateBlock(this.temp)
      .then(
        update => {console.log(update)}
      )
  }

  makeAppointment(employeeServiceService:EmployeeServiceService){

      if(this.person.contactName === undefined || this.person.employeeId === undefined || this.person.description === undefined || this.open === undefined){
          // alert('Please select all fields')
      swal("Oops...", "Please select all fields!", "error")
      }else{
        this.editBlock()
        this.person.employeeId = this.person.employeeId.id
        let start = moment(this.start).utcOffset(0)
        this.open = this.open[0].value.toString().split(':')
        start.set({'hour': this.open[0], 'minute': this.open[1]})
        this.person.startTime = start

        let end = moment(start)
        end.add(this.person.description[0].duration,'m')
        this.person.description = this.person.description[0].service
        this.person.endTime = end

        this.employeeServiceService.makeAppointment(this.person)
        .then(
          appointment => {
            console.log(appointment)
            this.newAppointment.emit(appointment)
            swal("Appointment Made!", "Your appointment has been succesfully made!", "success")
          }
        )
    }
}

    constructor(private employeeServiceService:EmployeeServiceService, private authService: AuthService, private companyService: CompanyService) {
        // this.user = this.authService.getUserAssociations()
        this.person.customerId = Number(localStorage.getItem('userId'))
        // for(var key in this.user){
        //   this.user.companyId = this.user[key][0]
        //   this.person.customerId = key
        //   this.person.companyId =this.user[key][0]
        // }
        this.employees = [];
  }

  ngOnDestroy() {
    this.companyIdSubscription.unsubscribe()
  }
}
