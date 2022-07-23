import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/Message';
import { AccountService } from 'src/app/services/account.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit, OnDestroy {
  public chatId: string;
  public messages: Message[];

  constructor(
    private chatService: ChatService,
    private accountService: AccountService,
    private socketService: SocketService,
    private route: ActivatedRoute
  ) {
    this.messages = [];
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.chatId = params['id'];
        this.populateMessageList();
        // this.socketService.connectChatMessages(this.chatId);
      },
    });
  }

  ngOnDestroy(): void {
    // TODO unsubscribe
  }

  private populateMessageList(): void {
    this.chatService.getChat(this.chatId).subscribe({
      next: (chat) => {
        this.messages = chat.messages;
      },
    });
  }

  cssClass(message: Message): string {
    const classes: string[] = [];
    if (message.author === this.accountService.getUsername()) {
      classes.push('text-white', 'text-end', 'bg-primary');
    }
    return classes.join(' ');
  }
}
