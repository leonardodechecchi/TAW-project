import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { NotificationType } from 'src/app/models/Notification';
import { Relationship } from 'src/app/models/Relationship';
import { User } from 'src/app/models/User';
import { AccountService } from 'src/app/services/account.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { ModalComponent } from '../modal/modal.component';

@UntilDestroy()
@Component({
  selector: 'friend-list',
  templateUrl: './friend-list.component.html',
})
export class FriendListComponent implements OnInit {
  public relationships: Relationship[];
  public searchField: FormControl;
  public userFound: User | null;
  public matchLoading: boolean;
  private modalRef: MdbModalRef<ModalComponent> | null;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private modalService: MdbModalService,
    private socketService: SocketService
  ) {
    this.relationships = [];
    this.searchField = new FormControl('');
    this.userFound = null;
    this.matchLoading = false;
  }

  public ngOnInit(): void {
    this.userService.getRelationships(this.accountService.getId()).subscribe({
      next: (relationships) => {
        this.userService.updateRelationships(relationships);
      },
    });

    // get the user relationships
    this.userService.relationships.pipe(untilDestroyed(this)).subscribe({
      next: (relationships) => {
        this.relationships = relationships.sort((relationship) =>
          relationship.friendId.online ? -1 : 0
        );
      },
    });

    // subscribe to friend request accepted event
    this.socketService.friendRequestAcceptedListener().subscribe({
      next: () => {
        this.userService
          .getRelationships(this.accountService.getId())
          .subscribe({
            next: (relationships) => {
              this.userService.updateRelationships(relationships);
            },
          });
      },
    });
  }

  /**
   * Open a modal dialog and displat the user statistics.
   * @param relationship the relationship
   */
  public openModal(relationship: Relationship): void {
    this.modalRef = this.modalService.open(ModalComponent, {
      data: { relationship, showFooter: true },
      modalClass: 'modal-fullscreen-sm-down',
    });
  }

  /**
   * Search for a user within the database.
   */
  public searchUser(): void {
    this.userService.getUserByUsername(this.searchField.value).subscribe({
      next: (user) => {
        this.userFound = null;

        if (this.relationships.length > 0) {
          let found: boolean = false;

          for (let relationship of this.relationships) {
            if (
              user.username === relationship.friendId.username ||
              user.username === this.accountService.getUsername()
            ) {
              found = true;
            }
          }

          if (!found) this.userFound = user;
        } else this.userFound = user;

        this.searchField.setValue('');
      },
      error: (err) => {
        this.userFound = null;
      },
    });
  }

  /**
   * Send a friend request notification.
   */
  public addFriend(): void {
    const senderId: string = this.accountService.getId();
    const type: NotificationType = NotificationType.FriendRequest;

    // post notification
    this.userService
      .postNotification(this.userFound.userId, {
        senderId,
        type,
      })
      .subscribe();
  }
}
