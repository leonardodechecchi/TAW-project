import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Notification } from 'src/app/models/Notification';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public notifications: Notification[];
  public username: string;
  public isAdminOrModerator: boolean;
  public numOnlineFriends: number;

  constructor(
    public authService: AuthService,
    public accountService: AccountService,
    public userService: UserService
  ) {
    this.notifications = [];
    this.username = '';
    this.isAdminOrModerator = false;
    this.numOnlineFriends = 0;
  }

  public ngOnInit(): void {
    this.userService.notifications.pipe(untilDestroyed(this)).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
    });

    this.userService.relationships.pipe(untilDestroyed(this)).subscribe({
      next: (relationships) => {
        this.numOnlineFriends = 0;
        for (let relationship of relationships) {
          if (relationship.friendId.online) this.numOnlineFriends++;
        }
      },
    });

    this.username = this.accountService.getUsername();
    this.isAdminOrModerator =
      this.accountService.isAdmin() || this.accountService.isModerator();
  }

  /**
   * Log out the user and clean the session.
   */
  public logout(): void {
    this.userService.userLogout(this.accountService.getUsername()).subscribe({
      next: () => {
        this.authService.logout();
      },
    });
  }
}
