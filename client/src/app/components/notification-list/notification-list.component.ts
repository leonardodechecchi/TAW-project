import { Component, OnInit } from '@angular/core';
import { Notification, NotificationType } from 'src/app/models/Notification';
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

    this.userService.notifications.subscribe({
      next: (notifications) => {},
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

  public acceptFriendRequest() {}

  public rejectFriendRequest(senderId: string, type: NotificationType) {
    const userId: string = this.accountService.getId();
    this.userService.deleteNotification(userId, { senderId, type }).subscribe({
      next: () => {
        this.populateNotificationList();
      },
      error: (err) => {
        console.error(err.error);
      },
    });
  }

  public acceptMatchRequest() {}

  public rejectMatchRequest() {}
}
