import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Match, MatchStats } from 'src/app/models/Match';
import { Player } from 'src/app/models/Player';
import { AccountService } from 'src/app/services/account.service';
import { MatchService } from 'src/app/services/match.service';
import { SocketService } from 'src/app/services/socket.service';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';

export enum ShotType {
  Hit = 'Hit',
  Missed = 'Missed',
}

@UntilDestroy()
@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  private matchId: string;
  private matchChatId: string;
  private matchStats: MatchStats;

  private player: Player;
  private opponentPlayer: Player;
  public turnOf: string;
  public winnerPlayer: string;

  public isMyTurn: boolean = false;

  public rowField: FormControl;
  public colField: FormControl;

  public errorMessage: string;
  public infoMessage: string;

  private shipColor: string = 'gray';
  private fireShotContent: string = '<i class="fas fa-times"></i>';
  private missedShotColor: string = '#1266f1';
  private missedShotContent: string = '<i class="fas fa-water text-white"></i>';
  private hitShotColor: string = '#f93154';
  private hitShotContent: string = '<i class="fas fa-fire text-white"></i>';
  private shipDestroyedContent: string =
    '<i class="fas fa-times text-white"></i>';

  constructor(
    private accountService: AccountService,
    private matchService: MatchService,
    private modalService: MdbModalService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.rowField = new FormControl(null);
    this.colField = new FormControl(null);
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.matchId = param['id'];

        // initialize grids
        this.initGrid();

        // initialize socket events
        this.initSocketEvents();
      },
    });
  }

  /**
   * Initialize the grid
   */
  private initGrid(): void {
    this.matchService.getMatch(this.matchId).subscribe({
      next: (match) => {
        this.matchChatId = match.playersChat;
        this.matchStats = match.stats;

        this.setPlayers(match);
        this.setTurnOf(match);

        // set ships on primary grid
        for (let ship of this.player.grid.ships) {
          for (let coordinate of ship.coordinates) {
            this.setCellColor(
              'table1',
              coordinate.row,
              coordinate.col,
              this.shipColor
            );
          }
        }

        // set shots received
        for (let shot of this.player.grid.shotsReceived) {
          this.setCellContent(
            'table1',
            shot.row,
            shot.col,
            this.fireShotContent
          );
        }

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
            this.updateStats({
              shipsDestroyed: this.matchStats.shipsDestroyed++,
            });

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

        // check if there is a winner
        this.winnerPlayer = this.winner();
      },
    });
  }

  /**
   * Register socket events
   */
  private initSocketEvents(): void {
    //
    this.socketService
      .shotFiredListener(this.matchId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (shot) => {
          // update the grid
          this.initGrid();
        },
      });

    //
    this.socketService
      .matchEndedListener()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (eventData) => {
          console.log(eventData.message);
          this.router.navigate(['home']);
        },
      });
  }

  /**
   *
   * @param stats
   */
  private updateStats(stats: Partial<MatchStats>): void {
    this.matchStats = { ...this.matchStats, ...stats };

    this.matchService
      .updateMatchStats(this.matchId, this.matchStats)
      .subscribe();
  }

  /**
   * Set the match players.
   */
  private setPlayers(match: Match): void {
    if (match.player1.playerUsername === this.accountService.getUsername()) {
      this.player = match.player1;
      this.opponentPlayer = match.player2;
    } else {
      this.player = match.player2;
      this.opponentPlayer = match.player1;
    }
  }

  /**
   * Set the current turn.
   */
  private setTurnOf(match: Match): void {
    if (match.turnOf === this.player.playerUsername) {
      this.isMyTurn = true;
      this.infoMessage = null;
      return;
    }
    this.isMyTurn = false;
    this.infoMessage = `${this.opponentPlayer.playerUsername}'s turn...`;
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
   * Checks if the given coordinates are correct.
   * To be precise, checks if the coordinates are numbers and
   * if are within the limits.
   * @param row the row index
   * @param col the col index
   * @returns `true` if the coordinates are correct, `false` otherwise
   */
  private checkCoordinates(row: number, col: number): boolean {
    if (isNaN(row) || isNaN(col)) return false;
    if (row < 0 || row > 9 || col < 0 || col > 9) return false;
    return true;
  }

  /**
   * Check if the given player is the winner.
   * @param player the player record
   * @returns true if the player has won, false otherwise
   */
  private isLoser(player: Player): boolean {
    let totalShips = 11;

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
        totalShips--;
      }
    }

    return totalShips === 0 ? true : false;
  }

  /**
   * Check if there is a winner.
   * @returns the winner of the match if exists, `null` otherwise
   */
  private winner(): string | null {
    if (this.isLoser(this.player)) {
      const winner: string = this.opponentPlayer.playerUsername;

      this.rowField.disable();
      this.colField.disable();

      this.updateStats({ winner, endTime: new Date() });
      this.infoMessage = `${winner} won!`;

      return this.opponentPlayer.playerUsername;
    } else {
      if (this.isLoser(this.opponentPlayer)) {
        const winner: string = this.player.playerUsername;

        this.rowField.disable();
        this.colField.disable();

        this.updateStats({ winner, endTime: new Date() });
        this.infoMessage = `${winner} won!`;

        return this.player.playerUsername;
      }
    }
    return null;
  }

  /**
   * Returns the index of the row corresponding to the letter in input.
   * @param letter the letter to parse
   * @returns the corresponding number index
   */
  public parseRow = (letter: string): number => {
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
  };

  /**
   * Open the game chat.
   */
  public openChat(): void {
    this.modalService.open(ChatModalComponent, {
      data: { chatId: this.matchChatId },
      modalClass: 'modal-fullscreen modal-dialog-scrollable',
    });
  }

  /**
   *
   */
  public leaveMatch(): void {
    // update match stats first
    this.updateStats({ endTime: new Date() });

    // then emit event to leave the match room
    this.socketService.emit<{ matchId: string; playerWhoLeft: string }>(
      'match-left',
      {
        matchId: this.matchId,
        playerWhoLeft: this.accountService.getUsername(),
      }
    );
  }

  /**
   * Fire a shot.
   */
  public shoot(): void {
    this.errorMessage = null;

    const row: number = this.parseRow(this.rowField.value);
    const col: number | any = this.colField.value;

    if (!this.checkCoordinates(row, col)) {
      this.errorMessage = 'Invalid coordinates!';
      return;
    }

    this.updateStats({ totalShots: this.matchStats.totalShots++ });

    this.matchService
      .fireAShot(this.matchId, this.player.playerUsername, { row, col })
      .subscribe({
        next: (match) => {
          this.setPlayers(match);
          this.setTurnOf(match);
        },
        error: (err) => {
          console.log(err);
          this.errorMessage = err.error;
        },
      });
  }
}
