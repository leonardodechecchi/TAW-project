import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Notification, NotificationType } from 'src/app/models/Notification';
import { AccountService } from 'src/app/services/account.service';
import { SocketService } from 'src/app/services/socket.service';
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
    private userService: UserService,
    private socketService: SocketService
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

  // OK
  private deleteNotification(
    notification: { senderId: string; type: string },
    error?: (err: any) => void
  ): void {
    const userId: string = this.accountService.getId();
    this.userService.deleteNotification(userId, notification).subscribe({
      next: (notifications) => {
        this.userService.updateNotifications(notifications);
      },
      error,
    });
  }

  // OK
  public acceptFriendRequest(senderId: string, type: NotificationType): void {
    this.deleteNotification({ senderId, type });

    const userId: string = this.accountService.getId();
    this.userService.createRelationship(userId, senderId).subscribe({
      next: (relationships) => {
        this.userService.updateRelationships(relationships);
      },
    });
  }

  // TODO
  public acceptMatchRequest(senderId: string, type: NotificationType): void {
    this.deleteNotification({ senderId, type });

    // ...
  }

  // OK
  public rejectFriendRequest(senderId: string, type: NotificationType): void {
    this.deleteNotification({ senderId, type });
  }

  // TODO
  public rejectMatchRequest(senderId: string, type: NotificationType) {
    this.deleteNotification({ senderId, type });

    // ...
    this.socketService.emit<string>('match-rejected', senderId);
  }
}
