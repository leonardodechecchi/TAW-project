import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Notification } from 'src/app/models/Notification';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatchService } from 'src/app/services/match.service';
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

  constructor(
    public authService: AuthService,
    public accountService: AccountService,
    public userService: UserService,
    private matchService: MatchService,
    private socketService: SocketService,
    private router: Router
  ) {
    this.notifications = [];

    // subscribe to 'match found' socket event
    this.socketService.matchFound().subscribe({
      next: (matchId) => {
        this.matchService.updateMatchLoading(false);
        this.router.navigate(['match', matchId, 'positioning-phase']);
      },
    });
  }

  ngOnInit(): void {
    // subscribe to notification socket service
    this.userService.notifications.pipe(untilDestroyed(this)).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
