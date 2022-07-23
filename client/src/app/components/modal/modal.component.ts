import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Relationship } from 'src/app/models/Relationship';
import { AccountService } from 'src/app/services/account.service';
import { RelationshipService } from 'src/app/services/relationship.service';
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
    private userService: UserService,
    private relationshipService: RelationshipService,
    private router: Router
  ) {}

  public goToChat() {
    const userId: string = this.accountService.getId();
    const friendId: string = this.relationship.friendId._id;
    if (this.relationship.chatId) {
      this.router.navigate(['/chats', this.relationship.chatId]);
    } else {
      this.relationshipService
        .createRelationshipChat(userId, friendId)
        .subscribe({
          next: (chat) => {
            this.router.navigate(['/chats', chat._id]);
          },
        });
    }
    this.modalRef.close();
  }

  public removeFriend() {
    const userId: string = this.accountService.getId();
    const friendId: string = this.relationship.friendId._id;
    this.userService.deleteRelationship(userId, friendId).subscribe({
      next: () => {
        this.modalRef.close();
      },
    });
  }
}
