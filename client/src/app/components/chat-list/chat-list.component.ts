import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Relationship } from 'src/app/models/Relationship';
import { UserService } from 'src/app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
})
export class ChatListComponent implements OnInit {
  public relationships: Relationship[];

  constructor(private userService: UserService, private router: Router) {
    this.relationships = [];
  }

  public ngOnInit(): void {
    this.userService.relationships.pipe(untilDestroyed(this)).subscribe({
      next: (relationships) => {
        this.relationships = relationships.filter((relationship) => {
          return !!relationship.chatId;
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
