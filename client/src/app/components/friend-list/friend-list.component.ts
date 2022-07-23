import { Component, OnInit } from '@angular/core';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Relationship } from 'src/app/models/Relationship';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'friend-list',
  templateUrl: './friend-list.component.html',
})
export class FriendListComponent implements OnInit {
  public relationships: Relationship[];

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private modalService: MdbModalService
  ) {
    this.relationships = [];
  }

  ngOnInit(): void {
    this.populateFriendList();
  }

  private populateFriendList(): void {
    const userId: string = this.accountService.getId();
    this.userService.getRelationships(userId).subscribe({
      next: (relationships) => {
        this.relationships = relationships;
      },
    });
  }

  public viewProfile(relationship: Relationship) {
    this.modalService.open(ModalComponent, {
      data: { relationship },
      modalClass: 'modal-fullscreen-sm-down',
    });
  }
}
