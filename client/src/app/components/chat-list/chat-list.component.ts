import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chat } from 'src/app/models/Chat';
import { Relationship } from 'src/app/models/Relationship';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
})
export class ChatListComponent implements OnInit {
  public relationships: Relationship[];
  public chats: Chat[];

  constructor(
    private userService: UserService,
    public accountService: AccountService,
    private router: Router
  ) {
    this.relationships = [];
    this.chats = [];
  }

  public ngOnInit(): void {
    this.userService.getUserChats(this.accountService.getId()).subscribe({
      next: (chats) => {
        this.chats = chats.sort((a, b) => {
          const date1: Date = new Date(a.messages[a.messages.length - 1].date);
          const date2: Date = new Date(b.messages[b.messages.length - 1].date);
          return date2.getTime() - date1.getTime();
        });
      },
    });
  }

  /**
   * Redirect the user to the given chat.
   * @param chatId the chat id
   */
  public openChat(chatId: string): void {
    this.router.navigate(['chats', chatId]);
  }
}
