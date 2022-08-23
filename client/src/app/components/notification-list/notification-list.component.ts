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
    // subscribe to notification socket service
    this.userService.notifications.pipe(untilDestroyed(this)).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
    });
  }

  /**
   * Delete the given notification.
   * @param notification the notification to delete
   * @param error if an error occurs
   */
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

  /**
   * Accept the friend request and create a relationship.
   * @param senderId the sender id
   * @param type the notification type
   */
  public acceptFriendRequest(senderId: string, type: NotificationType): void {
    const userId: string = this.accountService.getId();
    this.deleteNotification({ senderId, type });
    this.userService.createRelationship(userId, senderId).subscribe({
      next: (relationships) => {
        this.userService.updateRelationships(relationships);
      },
    });
  }

  /**
   * Rejecting the friend request is the same as dismissing the notification.
   * @param senderId the sender id
   * @param type the notification type
   */
  public rejectFriendRequest(senderId: string, type: NotificationType): void {
    this.deleteNotification({ senderId, type });
  }

  /**
   *
   * @param notification
   */
  public acceptMatchRequest(notification: Notification): void {
    this.deleteNotification({
      senderId: notification.senderId._id,
      type: notification.type,
    });

    this.socketService.emit<{ player1: string; player2: string }>(
      'match-request-accepted',
      {
        player1: this.accountService.getUsername(),
        player2: notification.senderId.username,
      }
    );
  }

  /**
   *
   * @param senderId
   * @param type
   */
  public rejectMatchRequest(senderId: string, type: NotificationType) {
    this.deleteNotification({ senderId, type });

    // ...
    this.socketService.emit<{ senderId: string }>('match-rejected', {
      senderId,
    });
  }
}
