import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdbCollapseDirective } from 'mdb-angular-ui-kit/collapse';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Notification, NotificationType } from 'src/app/models/Notification';
import { Relationship } from 'src/app/models/Relationship';
import { User } from 'src/app/models/User';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'friend-list',
  templateUrl: './friend-list.component.html',
})
export class FriendListComponent implements OnInit {
  public relationships: Relationship[];
  public searchField: FormControl;
  public userFound: User;
  private modalRef: MdbModalRef<ModalComponent>;
  public basicCollapse: MdbCollapseDirective;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private modalService: MdbModalService
  ) {
    this.relationships = [];
  }

  ngOnInit(): void {
    this.searchField = new FormControl('');
    this.populateFriendList();
  }

  // OK
  private populateFriendList(): void {
    const userId: string = this.accountService.getId();
    this.userService.getRelationships(userId).subscribe({
      next: (relationships) => {
        this.relationships = relationships;
      },
    });
  }

  // OK
  public openModal(relationship: Relationship): void {
    this.modalRef = this.modalService.open(ModalComponent, {
      data: { relationship },
      modalClass: 'modal-fullscreen-sm-down',
    });
    this.modalRef.onClose.subscribe(() => {
      this.populateFriendList();
    });
  }

  searchUser(): void {
    this.userService.getUserByUsername(this.searchField.value).subscribe({
      next: (user) => {
        this.searchField.setValue('');
        this.userFound =
          user.username === this.accountService.getUsername() ? null : user;
      },
      error: (err) => {
        console.error(err.error);
        this.userFound = null;
      },
    });
  }

  addFriend() {
    const senderId: string = this.accountService.getId();
    const type: NotificationType = NotificationType.FriendRequest;
    this.userService
      .postNotification(this.userFound.userId, {
        senderId,
        type,
      })
      .subscribe({
        error: (err) => {
          console.error(err.error);
        },
      });
  }
}
