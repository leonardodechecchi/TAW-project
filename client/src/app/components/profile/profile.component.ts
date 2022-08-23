import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomValidators } from 'src/app/helpers/CustomValidators';
import { UserStats } from 'src/app/models/User';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public userStats: UserStats;
  public profileForm: FormGroup;
  public passwordForm: FormGroup;
  public loading: boolean;

  constructor(
    public accountService: AccountService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.userService.getUser(this.accountService.getId()).subscribe({
      next: (user) => {
        this.loading = false;
        this.userStats = user.stats;
      },
    });

    this.profileForm = new FormGroup({
      username: new FormControl(this.accountService.getUsername(), [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl(this.accountService.getEmail()),
    });

    this.passwordForm = new FormGroup(
      {
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
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

  /**
   * Update the user username. The user must login again after
   * the update completed.
   */
  public updateUsername(): void {
    if (this.profileForm.invalid) return;

    const userId: string = this.accountService.getId();
    this.userService.updateUsername(userId, this.username.value).subscribe({
      next: (user) => {
        this.authService.logout();
      },
    });
  }
}
