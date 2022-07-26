import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomValidators } from 'src/app/helpers/CustomValidators';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public passwordForm: FormGroup;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      username: new FormControl(this.accountService.getUsername(), [
        Validators.required,
      ]),
      email: new FormControl(this.accountService.getEmail()),
    });

    this.passwordForm = new FormGroup(
      {
        newPassword: new FormControl('', [Validators.required]),
        repeatPassword: new FormControl('', [Validators.required]),
      },
      [CustomValidators.MatchValidator('newPassword', 'repeatPassword')]
    );
  }

  get username(): AbstractControl {
    return this.profileForm.get('username');
  }

  get newPassword(): AbstractControl {
    return this.passwordForm.get('newPassword');
  }

  get repeatPassword(): AbstractControl {
    return this.passwordForm.get('repeatPassword');
  }

  updateProfile() {}

  updatePassword() {}
}
