import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Relationship } from 'src/app/models/Relationship';
import { User } from 'src/app/models/User';
import { AccountService } from 'src/app/services/account.service';
import { ModeratorService } from 'src/app/services/moderator.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  public users: User[];

  constructor(
    public accountService: AccountService,
    private moderatorService: ModeratorService,
    private modalService: MdbModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.populateUsersList();
  }

  private populateUsersList(): void {
    const moderatorId: string = this.accountService.getId();
    this.moderatorService.getUsers(moderatorId).subscribe({
      next: (users) => {
        this.users = users;
      },
    });
  }

  /**
   * Delete permanently the user from the db.
   * @param userId the user id
   */
  public deleteUser(userId: string): void {
    const moderatorId: string = this.accountService.getId();
    this.moderatorService.deleteUser(moderatorId, userId).subscribe({
      next: () => {
        this.populateUsersList();
      },
    });
  }

  /**
   * Open the user stats.
   * @param user the user record
   */
  public openUserStats(user: User): void {
    const relationship: Relationship = {
      friendId: {
        _id: user.userId,
        username: user.username,
        online: user.online,
        stats: user.stats,
      },
      chatId: null,
    };

    this.modalService.open(ModalComponent, {
      data: { relationship, showFooter: false },
      modalClass: 'modal-fullscreen-sm-down',
    });
  }

  /**
   * Open the chat.
   * @param userUsername the user username
   */
  public openChat(userUsername: string): void {
    this.moderatorService.getChats(this.accountService.getId()).subscribe({
      next: (chats) => {
        let chatFound: boolean = false;

        for (let chat of chats) {
          if (
            (chat.users[0] === userUsername &&
              chat.users[1] === this.accountService.getUsername()) ||
            (chat.users[1] === userUsername &&
              chat.users[0] === this.accountService.getUsername())
          ) {
            chatFound = true;
            this.router.navigate(['chats', chat._id]);
          }
        }

        if (!chatFound) {
          this.moderatorService
            .createChat(this.accountService.getId(), userUsername)
            .subscribe({
              next: (chat) => {
                this.router.navigate(['chats', chat._id]);
              },
            });
        }
      },
    });
  }
}
