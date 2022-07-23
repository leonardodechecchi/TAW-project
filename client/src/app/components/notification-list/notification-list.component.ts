import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/models/Notification';
import { Relationship } from 'src/app/models/Relationship';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'notification-list',
  templateUrl: './notification-list.component.html',
})
export class NotificationListComponent implements OnInit {
  public notifications: Notification[];

  constructor(
    private accountService: AccountService,
    private userService: UserService
  ) {
    this.notifications = [];
  }

  ngOnInit(): void {
    this.populateNotificationList();
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
