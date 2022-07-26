import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Notification, NotificationType } from 'src/app/models/Notification';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@UntilDestroy()
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
    this.userService.notifications.pipe(untilDestroyed(this)).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
    });
  }

  // OK
  private populateNotificationList(): void {
    const userId: string = this.accountService.getId();
    this.userService.getNotifications(userId).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
    });
  }

  // TODO
  public acceptFriendRequest(friendId: string) {
    const userId: string = this.accountService.getId();
    this.userService.createRelationship(userId, friendId).subscribe({
      error: (err) => {
        console.error(err.error);
      },
    });
  }

  public rejectFriendRequest(senderId: string, type: NotificationType) {
    const userId: string = this.accountService.getId();
    this.userService.deleteNotification(userId, { senderId, type }).subscribe({
      next: (notifications) => {
        this.userService.updateNotifications(notifications);
      },
      error: (err) => {
        console.error(err.error);
      },
    });
  }

  // TODO
  public acceptMatchRequest() {}

  // TODO
  public rejectMatchRequest() {}
}
