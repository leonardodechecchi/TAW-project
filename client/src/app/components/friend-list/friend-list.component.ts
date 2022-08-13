import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MdbCollapseDirective } from 'mdb-angular-ui-kit/collapse';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { NotificationType } from 'src/app/models/Notification';
import { Relationship } from 'src/app/models/Relationship';
import { User } from 'src/app/models/User';
import { AccountService } from 'src/app/services/account.service';
import { MatchService } from 'src/app/services/match.service';
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
  public basicCollapse: MdbCollapseDirective;
  public matchLoading: boolean;
  private modalRef: MdbModalRef<ModalComponent> | null;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private matchService: MatchService,
    private modalService: MdbModalService
  ) {
    this.relationships = [];
    this.searchField = new FormControl('');
    this.userFound = null;
    this.matchLoading = false;
  }

  ngOnInit(): void {
    // this.populateFriendList();

    this.userService.relationships.pipe(untilDestroyed(this)).subscribe({
      next: (relationships) => {
        this.relationships = relationships;
      },
    });

    this.matchService.matchLoading.pipe(untilDestroyed(this)).subscribe({
      next: (matchLoading) => {
        this.matchLoading = matchLoading;
      },
    });
  }

  /** 
  private populateFriendList(): void {
    const userId: string = this.accountService.getId();
    this.userService.getRelationships(userId).subscribe({
      next: (relationships) => {
        this.relationships = relationships;
      },
    });
  }
  */

  // OK
  public openModal(relationship: Relationship): void {
    this.modalRef = this.modalService.open(ModalComponent, {
      data: { relationship },
      modalClass: 'modal-fullscreen-sm-down',
    });
  }

  // OK
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

  // OK
  public addFriend() {
    const senderId: string = this.accountService.getId();
    const type: NotificationType = NotificationType.FriendRequest;
    this.userService
      .postNotification(this.userFound.userId, {
        senderId,
        type,
      })
      .subscribe();
  }
}
