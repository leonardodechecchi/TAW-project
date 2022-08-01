import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Notification } from 'src/app/models/Notification';
import { Relationship } from 'src/app/models/Relationship';
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
  public numFriendsOnline: number;

  constructor(
    public authService: AuthService,
    public accountService: AccountService,
    public userService: UserService
  ) {
    this.notifications = [];
    this.numFriendsOnline = 0;
  }

  ngOnInit(): void {
    this.userService.notifications.pipe(untilDestroyed(this)).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
    });
    this.userService.relationships.pipe(untilDestroyed(this)).subscribe({
      next: (relationships) => {
        this.numFriendsOnline = 0;
        for (let relationship of relationships) {
          if (relationship.friendId.online) this.numFriendsOnline++;
        }
      },
    });
  }
}
