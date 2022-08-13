import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Match } from 'src/app/models/Match';
import { MatchService } from 'src/app/services/match.service';
import { SocketService } from 'src/app/services/socket.service';

@UntilDestroy()
@Component({
  selector: 'observer',
  templateUrl: './observer.component.html',
})
export class ObserverComponent implements OnInit {
  private matchId: string;
  private match: Match;

  private observersChatId: string;

  public positioniongPhase: boolean;

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private matchService: MatchService
  ) {
    this.positioniongPhase = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.matchId = param['id'];

        this.matchService.getMatch(this.matchId).subscribe({
          next: (match) => {
            this.match = match;
            this.positioniongPhase =
              this.match.player1.grid.ships.length > 0 ? false : true;
          },
        });
      },
    });

    // when players are ready
    this.socketService
      .positioningCompletedListener()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (eventData) => {
          this.positioniongPhase = false;
        },
      });
  }

  private initGrid(): void {
    this.matchService.getMatch(this.matchId).subscribe({
      next: (match) => {
        this.observersChatId = match.playersChat;

        this.setPlayers(match);
        this.setTurnOf(match);

        // set fired shots on secondary grid
        for (let shot of this.opponentPlayer.grid.shotsReceived) {
          let found: boolean = false;

          for (let ship of this.opponentPlayer.grid.ships) {
            for (let coordinate of ship.coordinates) {
              if (shot.row === coordinate.row && shot.col === coordinate.col) {
                found = true;
                this.setCellType(
                  'table2',
                  coordinate.row,
                  coordinate.col,
                  ShotType.Hit
                );
              }
            }
          }

          if (!found) {
            this.setCellType('table2', shot.row, shot.col, ShotType.Missed);
          }
        }

        // set ships destroyed
        for (let ship of this.opponentPlayer.grid.ships) {
          let shipDestroyed: boolean = true;

          for (let coord of ship.coordinates) {
            let coordFound: boolean = false;

            for (let shot of this.opponentPlayer.grid.shotsReceived) {
              if (coord.row === shot.row && coord.col === shot.col) {
                coordFound = true;
                break;
              }
            }

            if (!coordFound) {
              shipDestroyed = false;
              break;
            }
          }

          if (shipDestroyed) {
            for (let coordinate of ship.coordinates) {
              this.setCellContent(
                'table2',
                coordinate.row,
                coordinate.col,
                this.shipDestroyedContent
              );
            }
          }
        }

        // check if there is already a winner
        this.winnerPlayer = this.winner();
      },
    });
  }

  private initMatch() {
    this.matchService.getMatch(this.matchId).subscribe({
      next: (match) => {
        this.match = match;
        this.positioniongPhase =
          this.match.player1.grid.ships.length > 0 ? false : true;
      },
    });
  }
}
