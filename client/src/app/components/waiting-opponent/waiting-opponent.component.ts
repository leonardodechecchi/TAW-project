import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/services/match.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'waiting-opponent',
  templateUrl: './waiting-opponent.component.html',
})
export class WaitingOpponentComponent {
  constructor(
    private matchService: MatchService,
    private socketService: SocketService,
    private router: Router
  ) {}

  cancel() {
    this.matchService.updateMatchLoading(false);
    this.socketService.emit('match-left');
    this.router.navigate(['home']);
    // TODO leave match etc.
  }
}
