import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/models/Message';
import { AccountService } from 'src/app/services/account.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketService } from 'src/app/services/socket.service';

@UntilDestroy()
@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  public chatId: string;
  public messages: Message[];
  public messageText: FormControl;

  constructor(
    private chatService: ChatService,
    private accountService: AccountService,
    private socketService: SocketService,
    private route: ActivatedRoute
  ) {
    this.messages = [];
  }

  ngOnInit(): void {
    this.messageText = new FormControl('');
    this.route.params.subscribe({
      next: (params) => {
        this.chatId = params['id'];
        this.populateMessageList();
        this.socketService
          .connectChatMessages(this.chatId)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (message) => {
              this.messages.push(message);
            },
          });
      },
    });
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

  // OK
  sendMessage(): void {
    const message: Message = {
      author: this.accountService.getUsername(),
      content: this.messageText.value,
      date: new Date(),
    };
    this.chatService.addMessage(this.chatId, message).subscribe({
      next: () => {
        this.messageText.setValue('');
        this.populateMessageList();
      },
    });
  }
}
