import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { AccountService } from 'src/app/services/account.service';
import { ModeratorService } from 'src/app/services/moderator.service';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  public users: User[];

  constructor(
    private accountService: AccountService,
    private moderatorService: ModeratorService
  ) {}

  ngOnInit(): void {
    this.populateUsersList();
  }

  // OK
  private populateUsersList(): void {
    const moderatorId: string = this.accountService.getId();
    this.moderatorService.getUsers(moderatorId).subscribe({
      next: (users) => {
        this.users = users;
      },
    });
  }

  public deleteUser(userId: string) {
    const moderatorId: string = this.accountService.getId();
    this.moderatorService.deleteUser(moderatorId, userId).subscribe({
      next: () => {
        this.populateUsersList();
      },
    });
  }
}
