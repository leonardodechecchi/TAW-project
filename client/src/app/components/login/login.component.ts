import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get remember() {
    return this.form.get('remember');
  }

  submit() {
    if (this.form.valid) {
      this.authService
        .login(this.email.value, this.password.value, this.remember.value)
        .subscribe({
          next: (token) => {
            this.accountService.updateToken(token);
            this.accountService.isModerator() && !this.accountService.isActive()
              ? this.router.navigate(['/account'])
              : this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = err;
          },
        });
    }
  }
}