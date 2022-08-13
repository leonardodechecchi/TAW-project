import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Match } from 'src/app/models/Match';
import { MatchService } from 'src/app/services/match.service';
import { SocketService } from 'src/app/services/socket.service';

@UntilDestroy()
@Component({
  selector: 'match-list',
  templateUrl: './match-list.component.html',
})
export class MatchListComponent implements OnInit {
  public matches: Match[];

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private matchService: MatchService,
    private router: Router
  ) {
    this.matches = [];
  }

  ngOnInit(): void {
    this.matchService.getActiveMatches().subscribe({
      next: (matches) => {
        console.log(matches);
        this.matches = matches;
      },
    });

    // subscribe to match available socket event
    this.socketService
      .matchAvailableListener()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (eventData) => {},
      });
  }

  /**
   *
   * @param match
   */
  public watchGame(match: Match) {
    this.router.navigate(['match', match._id, 'observer']);
  }
}
