import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee.component';
import { EmployeeScheduleComponent } from './employee-schedule/employee-schedule.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { DropdownModule, CalendarModule} from 'primeng/primeng';
import { SharedModule } from '../shared/shared.module';
import { EmployeeServiceService } from './employee-service.service';
import { EmployeeAppointmentDetailComponent } from './employee-schedule/employee-appointment-detail.component';
import { EmployeeRoutingModule } from './employee-routing.module';

// import { AuthService } from '../auth/auth.service'

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    CalendarModule,
    FormsModule,
    SharedModule,
    EmployeeRoutingModule
  ],
  exports: [
    EmployeeComponent,
    EmployeeScheduleComponent,
    EmployeeFormComponent,
  ],
  providers: [EmployeeServiceService],
  declarations: [EmployeeComponent, EmployeeScheduleComponent, EmployeeFormComponent, EmployeeAppointmentDetailComponent]
})
export class EmployeeModule { 

}
