import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { NotificationType } from 'src/app/models/Notification';
import { Relationship } from 'src/app/models/Relationship';
import { AccountService } from 'src/app/services/account.service';
import { MatchService } from 'src/app/services/match.service';
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
    private matchService: MatchService,
    private relationshipService: RelationshipService,
    private router: Router
  ) {}

  // OK
  public match(): void {
    const userId: string = this.accountService.getId();
    const recipientId: string = this.relationship.friendId._id;
    const type: NotificationType = NotificationType.MatchRequest;

    this.userService
      .postNotification(recipientId, { senderId: userId, type })
      .subscribe({
        error: () => {
          this.matchService.updateMatchLoading(false);
        },
      });

    this.modalRef.close();
    this.matchService.updateMatchLoading(true);
  }

  // OK
  public chat(): void {
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

  // OK
  public removeFriend(): void {
    const userId: string = this.accountService.getId();
    const friendId: string = this.relationship.friendId._id;

    this.userService.deleteRelationship(userId, friendId).subscribe({
      next: (relationships) => {
        this.userService.updateRelationships(relationships);
      },
    });
    this.modalRef.close();
  }
}
