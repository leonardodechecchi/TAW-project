import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatchService } from 'src/app/services/match.service';
import { SocketService } from 'src/app/services/socket.service';

@UntilDestroy()
@Component({
  selector: 'waiting-room',
  templateUrl: './waiting-room.component.html',
})
export class WaitingRoomComponent implements OnInit {
  constructor(
    private matchService: MatchService,
    private socketService: SocketService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    // subscribe to match found socket event
    this.socketService
      .matchFoundListener()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (eventData) => {
          this.socketService.emit<{ matchId: string }>('match-joined', {
            matchId: eventData.matchId,
          });
          this.matchService.updateMatchLoading(false);
          this.router.navigate([
            'match',
            eventData.matchId,
            'positioning-phase',
          ]);
        },
      });

    // when both players are ready
    this.socketService
      .positioningCompletedListener()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (eventData) => {
          this.matchService.updateMatchLoading(false);
          this.router.navigate(['match', eventData.matchId, 'game']);
        },
      });
  }
}
