import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/Message';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  public chatId: string;
  public messages: Message[];

  constructor(private route: ActivatedRoute) {
    this.messages = [];
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.chatId = params['id'];
      },
    });
  }

  private populateMessageList() {}
}
