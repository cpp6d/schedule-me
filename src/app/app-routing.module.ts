import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CustomerComponent } from './customer/customer.component'
import { EmployeeComponent } from './employee/employee.component'
import { CompanyComponent } from './company/company.component'
import { HomeComponent } from './home.component'
import { CompanyLandingComponent } from './company/company-landing.component'
import { AuthComponent } from './auth/auth.component'
import { AuthGuard } from './auth/auth-guard.service'
import { SigninComponent } from './auth/signin.component'
import { SignupComponent } from './auth/signup.component'

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'users', component: CustomerComponent, canActivate: [AuthGuard]},
    { path: 'admin', component: CompanyLandingComponent},
    { path: 'work', component: EmployeeComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    providers: [AuthGuard],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }

