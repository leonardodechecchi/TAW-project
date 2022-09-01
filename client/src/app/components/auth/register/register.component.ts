import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  public form: FormGroup;
  public errorMessage: string;
  public infoMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
  }

  get name() {
    return this.form.get('name');
  }
  get surname() {
    return this.form.get('surname');
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

  /**
   * Submit the register form.
   */
  public submit() {
    this.infoMessage = null;

    if (this.form.valid) {
      this.authService
        .register(
          this.name.value,
          this.surname.value,
          this.username.value,
          this.email.value,
          this.password.value
        )
        .subscribe({
          next: () => {
            this.errorMessage = '';
            this.infoMessage =
              'We have sent you an email, please check it to continue';
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = err.error;
          },
        });
    }
  }
}
