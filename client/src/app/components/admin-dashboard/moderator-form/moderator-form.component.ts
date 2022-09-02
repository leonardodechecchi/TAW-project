import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { ModeratorService } from 'src/app/services/moderator.service';

@Component({
  selector: 'moderator-form',
  templateUrl: './moderator-form.component.html',
})
export class ModeratorFormComponent implements OnInit {
  public moderatorForm: FormGroup;
  public infoMessage: string;

  constructor(
    private accountService: AccountService,
    private moderatorService: ModeratorService
  ) {
    this.infoMessage = '';
  }

  public ngOnInit(): void {
    this.moderatorForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });
  }

  get name(): AbstractControl {
    return this.moderatorForm.get('name');
  }

  get surname(): AbstractControl {
    return this.moderatorForm.get('surname');
  }

  get email(): AbstractControl {
    return this.moderatorForm.get('email');
  }

  /**
   * Create a user with moderator role with
   * the given information.
   */
  public createModeratorUser(): void {
    if (this.moderatorForm.invalid) return;

    this.moderatorService
      .createModeratorUser(
        this.accountService.getId(),
        this.name.value,
        this.surname.value,
        this.email.value
      )
      .subscribe({
        next: (user) => {
          this.infoMessage = 'New moderator user created';
        },
      });
  }
}
