import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Relationship } from 'src/app/models/Relationship';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
})
export class ChatListComponent implements OnInit {
  public relationships: Relationship[];

  constructor(private userService: UserService) {
    this.relationships = [];
  }

  ngOnInit(): void {
    this.userService.relationships.pipe(untilDestroyed(this)).subscribe({
      next: (relationships) => {
        this.relationships = relationships.filter((relationship) => {
          return !!relationship.chatId;
        });
      },
    });
  }
}
