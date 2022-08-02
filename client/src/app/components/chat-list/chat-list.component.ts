import { Component, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/Chat';
import { Relationship } from 'src/app/models/Relationship';
import { AccountService } from 'src/app/services/account.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
})
export class ChatListComponent implements OnInit {
  public relationships: Relationship[];

  constructor(
    private accountService: AccountService,
    private userService: UserService
  ) {
    this.relationships = [];
  }

  ngOnInit(): void {
    this.populateChatList();
  }

  // OK
  private populateChatList(): void {
    const userId: string = this.accountService.getId();
    this.userService.getRelationships(userId).subscribe({
      next: (relationships) => {
        this.relationships = relationships.filter((relationship) => {
          return !!relationship.chatId;
        });
      },
    });
  }
}
