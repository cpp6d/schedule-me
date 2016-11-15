import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { CustomerService } from '../customer.service'
@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
  
  public editAccountForm: FormGroup
  public submitted: boolean = false
  public incorrectPassword: boolean = false
  public showErrorMsg: boolean = false
  public showSuccessMsg: boolean = false
  private subscription: any
  private userId: number = Number(localStorage.getItem('userId'))
  
  constructor(private formBuilder: FormBuilder, private customerService: CustomerService) { }

  @Input() user: any

  ngOnInit() {
    this.editAccountForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required]],
      image: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })

  }

  onSubmit(update) {
    this.submitted = true
    console.log(update)
    if (this.editAccountForm.valid) {
      this.subscription = this.customerService.submitUserUpdates(this.userId, update)
        .subscribe(
          (res) => {
            if (res.response.success) {
              this.showSuccessMsg = true
            } else if (res.response.message === 'incorrect password') {
              this.incorrectPassword = true
            }
          },
          (err) => {
            this.showErrorMsg = true
            console.error(err)
          },
          () => {
            console.log('done')
          }
        )
    }
  }
}