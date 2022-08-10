import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Message } from 'src/app/models/Message';
import { AccountService } from 'src/app/services/account.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketService } from 'src/app/services/socket.service';

@UntilDestroy()
@Component({
  selector: 'chat-modal',
  templateUrl: './chat-modal.component.html',
})
export class ChatModalComponent implements OnInit {
  private chatId: string;
  public opponentUsername: string;
  public messages: Message[];
  public messageField: FormControl;

  constructor(
    public modalRef: MdbModalRef<ChatModalComponent>,
    private accountService: AccountService,
    private chatService: ChatService,
    private socketService: SocketService
  ) {
    this.messageField = new FormControl('');
  }

  ngOnInit(): void {
    this.populateMessageList();

    // subscribe to chat message socket service
    this.socketService
      .chatMessageListener(this.chatId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (message) => {
          this.messages.push(message);
        },
      });
  }

  /**
   * Populate the chat list.
   */
  private populateMessageList(): void {
    this.chatService.getChat(this.chatId).subscribe({
      next: (chat) => {
        this.opponentUsername = chat.users.find((username) => {
          return username !== this.accountService.getUsername();
        });
        this.messages = chat.messages;
      },
    });
  }

  /**
   * Set a css class.
   * @param message the message
   * @returns the css class
   */
  public cssClass(message: Message): string {
    const classes: string[] = [];
    if (message.author === this.accountService.getUsername()) {
      classes.push('text-white', 'text-end', 'bg-primary');
    }
    return classes.join(' ');
  }

  /**
   * Send the message.
   */
  public sendMessage(): void {
    const message: Message = {
      author: this.accountService.getUsername(),
      content: this.messageField.value,
      date: new Date(),
    };
    this.chatService.addMessage(this.chatId, message).subscribe({
      next: () => {
        this.messageField.setValue('');
      },
    });
  }
}
