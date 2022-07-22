import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'update-password',
  templateUrl: './update-password.component.html',
})
export class UpdatePasswordComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      newPassword: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  submit() {
    if (this.form.valid) {
      this.userService
        .modifyPassword(this.accountService.getId(), this.newPassword.value)
        .subscribe({
          next: () => {
            console.log('Password updated');
            this.router.navigate(['/auth']);
          },
          error: (err) => {
            console.error(err);
          },
        });
    }
  }
}
