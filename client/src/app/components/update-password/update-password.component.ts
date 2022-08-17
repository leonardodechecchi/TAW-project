import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'update-password',
  templateUrl: './update-password.component.html',
})
export class UpdatePasswordComponent implements OnInit {
  public passwordForm: FormGroup;
  public errorMessage: string;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
      repeatPassword: new FormControl(''),
    });
  }

  public get currentPassword() {
    return this.passwordForm.get('currentPassword');
  }

  public get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  public get repeatPassword() {
    return this.passwordForm.get('repeatPassword');
  }

  public submit() {
    this.errorMessage = null;

    if (this.passwordForm.valid) {
      // update the password
      this.userService
        .updatePassword(
          this.accountService.getId(),
          this.currentPassword.value,
          this.newPassword.value
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/auth']);
          },
          error: (err) => {
            this.errorMessage = err.error;
          },
        });
    }
  }
}
