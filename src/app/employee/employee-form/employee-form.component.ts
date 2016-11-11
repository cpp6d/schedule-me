import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment'

import {SelectItem} from 'primeng/primeng';

import {EmployeeServiceService} from '../employee-service.service'

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {
    date : Date ; 
    public user: {}
    employees: SelectItem[];
    hours: SelectItem[];
    services: SelectItem[];
    start;
    times;

    person = {
      contactName: '',
      contactNumber: '',
      description: undefined,
      startTime: undefined,
      endTime: undefined,
      customerId :'1',
      employeeId : '',
      companyId : '1'
    }
  @Output() clicked = new EventEmitter<string>();

  makeAppointment(employeeServiceService:EmployeeServiceService){
    let end = moment(this.start)
    this.person.startTime = end.format()
    end.add(this.person.description[0].value,'m')
    this.person.description = this.person.description[0].label
    this.person.endTime = end.format()
    console.log('person end',this.person)
    this.employeeServiceService.makeAppointment(this.person)
    .then(
      appointment => {
        console.log(appointment)
        }
    )
  }

    constructor(private employeeServiceService:EmployeeServiceService) {
 
        employeeServiceService.getEmployees(1)
        .subscribe(
          employee => {
          this.employees = employee.json().response.employees
        }
        )

        this.employees = [];
        
        this.hours = []
        this.hours.push({label: "09:00",value: "09:00"})
        this.hours.push({label: "09:15",value: "09:15"})
        this.hours.push({label: "09:30",value: "09:30"})
        this.hours.push({label: "09:45",value: "09:45"})
        this.hours.push({label: "10:00",value: "10:00"})
        this.hours.push({label: "10:15",value: "10:15"})
        this.hours.push({label: "10:30",value: "10:30"})
        this.hours.push({label: "10:45",value: "10:45"})
        this.hours.push({label: "11:00",value: "11:00"})
        this.hours.push({label: "11:15",value: "11:15"})
        this.hours.push({label: "11:30",value: "11:30"})
        this.hours.push({label: "11:45",value: "11:45"})
        this.hours.push({label: "12:00",value: "12:00"})
        this.hours.push({label: "12:15",value: "12:15"})
        this.hours.push({label: "12:30",value: "12:30"})
        this.hours.push({label: "12:45",value: "12:45"})
        this.hours.push({label: "13:00",value: "13:00"})
        this.hours.push({label: "13:15",value: "13:15"})
        this.hours.push({label: "13:30",value: "13:30"})
        this.hours.push({label: "13:45",value: "13:45"})
        this.hours.push({label: "14:00",value: "14:00"})
        this.hours.push({label: "14:15",value: "14:15"})
        this.hours.push({label: "14:30",value: "14:30"})
        this.hours.push({label: "14:45",value: "14:45"})
        this.hours.push({label: "15:00",value: "15:00"})
        this.hours.push({label: "15:15",value: "15:15"})
        this.hours.push({label: "15:30",value: "15:30"})
        this.hours.push({label: "15:45",value: "15:45"})


        this.services =[]
        this.services.push({label: "Manicure",value: 15})
        this.services.push({label: "Pedicure",value: 30})
        this.services.push({label: "Wax",value: 15})  
  }

}
