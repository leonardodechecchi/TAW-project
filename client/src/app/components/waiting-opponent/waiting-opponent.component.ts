import { Component } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'waiting-opponent',
  templateUrl: './waiting-opponent.component.html',
})
export class WaitingOpponentComponent {
  constructor(private socketService: SocketService) {}
}
