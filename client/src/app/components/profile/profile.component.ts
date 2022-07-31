import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomValidators } from 'src/app/helpers/CustomValidators';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public passwordForm: FormGroup;
  public imageData: string;
  public alt: string = environment.profile_picture;

  constructor(
    public accountService: AccountService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.imageData = this.accountService.getImagePath();
    this.profileForm = new FormGroup({
      username: new FormControl(this.accountService.getUsername(), [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl(this.accountService.getEmail()),
      image: new FormControl(null),
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

  get image(): AbstractControl {
    return this.profileForm.get('image');
  }

  get newPassword(): AbstractControl {
    return this.passwordForm.get('newPassword');
  }

  get repeatPassword(): AbstractControl {
    return this.passwordForm.get('repeatPassword');
  }

  updateProfile() {
    if (this.profileForm.valid) {
      if (this.image.value) {
        const imageData = new FormData();
        imageData.append('image', this.image.value);
        this.userService
          .uploadPicture(this.accountService.getId(), imageData)
          .subscribe();
      }
    }
  }

  updatePassword() {}

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.profileForm.patchValue({ image: file });
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (file && allowedMimeTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Wrong file');
    }
  }

  selectPicture() {
    document.getElementById('updateProfilePicture').click();
  }

  onSubmit() {
    console.log('submit profile');
    this.profileForm.reset();
    this.imageData = null;
  }
}
