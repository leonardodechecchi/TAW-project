import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Relationship } from 'src/app/models/Relationship';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  public relationship: Relationship;

  constructor(
    public modalRef: MdbModalRef<ModalComponent>,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  removeFriend() {
    const userId: string = this.accountService.getId();
    const friendId: string = this.relationship.friendId._id;
    this.userService.deleteRelationship(userId, friendId).subscribe({
      next: () => {
        console.log('Friend removed');
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
