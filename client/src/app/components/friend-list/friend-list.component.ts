import { Component, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
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
  private modalRef: MdbModalRef<ModalComponent>;

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
  public openModal(relationship: Relationship) {
    this.modalRef = this.modalService.open(ModalComponent, {
      data: { relationship },
      modalClass: 'modal-fullscreen-sm-down',
    });
    this.modalRef.onClose.subscribe(() => {
      this.populateFriendList();
    });
  }
}
