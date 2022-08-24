import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Match } from 'src/app/models/Match';
import { Player } from 'src/app/models/Player';
import { MatchService } from 'src/app/services/match.service';
import { SocketService } from 'src/app/services/socket.service';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';
import { ShotType } from '../game/game.component';

@UntilDestroy()
@Component({
  selector: 'observer',
  templateUrl: './observer.component.html',
  styleUrls: ['./observer.component.scss'],
})
export class ObserverComponent implements OnInit {
  private matchId: string;
  public player1: Player;
  public player2: Player;
  public turnOf: string = '';
  private observersChatId: string;

  public positioningPhase: boolean;

  private missedShotColor: string = '#1266f1';
  private missedShotContent: string = '<i class="fas fa-water text-white"></i>';
  private hitShotColor: string = '#f93154';
  private hitShotContent: string = '<i class="fas fa-fire text-white"></i>';
  private shipDestroyedContent: string =
    '<i class="fas fa-times text-white"></i>';

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private matchService: MatchService,
    private modalService: MdbModalService,
    private router: Router
  ) {
    this.positioningPhase = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.matchId = param['id'];

        // subscribe to shot fired socket event
        this.socketService
          .shotFiredListener(this.matchId)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (shot) => {
              if (this.positioningPhase) this.positioningPhase = false;

              this.matchService.getMatch(this.matchId).subscribe({
                next: (match) => {
                  this.player1 = match.player1;
                  this.player2 = match.player2;

                  // check if the players are positioning the ships
                  shot.shooterUsername === this.player1.playerUsername
                    ? this.initGrid(this.player2)
                    : this.initGrid(this.player1);
                },
              });
            },
          });

        this.socketService
          .matchEndedListener()
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (eventData) => {
              this.router.navigate(['match', this.matchId, 'result'], {
                state: { message: eventData.message },
              });
            },
          });

        // init players grid
        this.matchService.getMatch(this.matchId).subscribe({
          next: (match) => {
            this.player1 = match.player1;
            this.player2 = match.player2;
            this.observersChatId = match.observersChat;

            this.setTurnOf(match);

            this.player1.ready && this.player2.ready
              ? (this.positioningPhase = false)
              : (this.positioningPhase = true);

            this.initGrid(this.player1);
            this.initGrid(this.player2);
          },
        });
      },
    });
  }

  /**
   *
   * @param player
   */
  private initGrid(player: Player) {
    const tableName: string =
      player.playerUsername === this.player1.playerUsername
        ? 'table1'
        : 'table2';

    for (let shot of player.grid.shotsReceived) {
      let found: boolean = false;

      for (let ship of player.grid.ships) {
        for (let coordinate of ship.coordinates) {
          // HIT
          if (shot.row === coordinate.row && shot.col === coordinate.col) {
            found = true;
            this.setCellType(
              tableName,
              coordinate.row,
              coordinate.col,
              ShotType.Hit
            );
          }
        }
      }

      // MISSED
      if (!found) {
        this.setCellType(tableName, shot.row, shot.col, ShotType.Missed);
      }
    }

    // set destroyed ships
    for (let ship of player.grid.ships) {
      let shipDestroyed: boolean = true;

      for (let coord of ship.coordinates) {
        let coordFound: boolean = false;

        for (let shot of player.grid.shotsReceived) {
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
            tableName,
            coordinate.row,
            coordinate.col,
            this.shipDestroyedContent
          );
        }
      }
    }
  }

  /**
   * Calculate the index to access table cell.
   * @param row the row
   * @param col the col
   * @returns the result
   */
  private getCellId(row: number, col: number): string {
    return String(row * 10 + col);
  }

  /**
   * Set the cell color.
   * @param tableName the table name
   * @param row the row index
   * @param col the col index
   * @param color the color to set
   */
  private setCellColor(
    tableName: string,
    row: number,
    col: number,
    color: string
  ): void {
    let td: HTMLElement | null = document.getElementById(
      tableName + this.getCellId(row, col)
    );
    td.style.background = color;
  }

  /**
   *
   * @param tableName the table name
   * @param row the row index
   * @param col the col index
   */
  private setCellContent(
    tableName: string,
    row: number,
    col: number,
    content: string
  ): void {
    let td: HTMLElement | null = document.getElementById(
      tableName + this.getCellId(row, col)
    );
    td.innerHTML = content;
  }

  /**
   * Change the background color of the table cell.
   * @param tableName
   * @param row
   * @param col
   * @param type
   */
  private setCellType(
    tableName: string,
    row: number,
    col: number,
    type: ShotType
  ): void {
    if (type === ShotType.Hit) {
      this.setCellColor(tableName, row, col, this.hitShotColor);
      this.setCellContent(tableName, row, col, this.hitShotContent);
    } else {
      this.setCellColor(tableName, row, col, this.missedShotColor);
      this.setCellContent(tableName, row, col, this.missedShotContent);
    }
  }

  /**
   * Returns the index of the row corresponding to the letter in input.
   * @param letter the letter to parse
   * @returns the corresponding number index
   */
  public parseRow(letter: string): number {
    try {
      switch (letter.toUpperCase()) {
        case 'A':
          return 0;
        case 'B':
          return 1;
        case 'C':
          return 2;
        case 'D':
          return 3;
        case 'E':
          return 4;
        case 'F':
          return 5;
        case 'G':
          return 6;
        case 'H':
          return 7;
        case 'I':
          return 8;
        case 'J':
          return 9;
        default: {
          return -1;
        }
      }
    } catch (err) {
      return -1;
    }
  }

  private setTurnOf(match: Match): void {
    match.turnOf === match.player1.playerUsername
      ? (this.turnOf = match.player1.playerUsername)
      : (this.turnOf = match.player2.playerUsername);
  }

  /**
   * Open the observers chat.
   */
  public openChat(): void {
    this.modalService.open(ChatModalComponent, {
      data: { chatId: this.observersChatId },
      modalClass: 'modal-fullscreen modal-dialog-scrollable',
    });
  }
}
