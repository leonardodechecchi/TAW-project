import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/models/Notification';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  public notifications: Notification[];

  constructor(
    public authService: AuthService,
    public accountService: AccountService,
    public userService: UserService
  ) {
    this.notifications = [];
  }

  ngOnInit(): void {
    this.populateNotificationList();
    this.userService.notifications.subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
    });
  }

  private populateNotificationList(): void {
    const userId: string = this.accountService.getId();
    this.userService.getNotifications(userId).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
    });
  }
}
