import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Notification } from 'src/app/models/Notification';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public notifications: Notification[];
  public friendsOnline: number;

  constructor(
    public authService: AuthService,
    public accountService: AccountService,
    public userService: UserService,
    private socketService: SocketService
  ) {
    this.notifications = [];
    this.friendsOnline = 0;
  }

  ngOnInit(): void {
    this.userService.notifications.pipe(untilDestroyed(this)).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
    });

    this.userService.relationships.pipe(untilDestroyed(this)).subscribe({
      next: (relationships) => {
        this.friendsOnline = 0;
        for (let relationship of relationships) {
          if (relationship.friendId.online) this.friendsOnline++;
        }
      },
    });
  }

  logout() {
    this.socketService.emit('offline');
    this.authService.logout();
  }
}
