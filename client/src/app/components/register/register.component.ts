import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  public form: FormGroup;
  public errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
  }

  get username() {
    return this.form.get('username');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  submit() {
    if (this.form.valid) {
      this.authService
        .register(this.username.value, this.email.value, this.password.value)
        .subscribe({
          next: () => {
            this.errorMessage = '';
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = err;
          },
        });
    }
  }
}
