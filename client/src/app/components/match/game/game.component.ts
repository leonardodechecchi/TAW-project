import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Match } from 'src/app/models/Match';
import { Player } from 'src/app/models/Player';
import { UserStats } from 'src/app/models/User';
import { AccountService } from 'src/app/services/account.service';
import { MatchService } from 'src/app/services/match.service';
import { SocketService } from 'src/app/services/socket.service';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';

enum ShotType {
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

  private player: Player;
  private opponentPlayer: Player;
  public turnOf: string;

  public isMyTurn: boolean = false;

  public rowField: FormControl;
  public colField: FormControl;

  public errorMessage: string;

  private shipColor: string;
  private missedShotColor: string;
  private missedShotContent: string;
  private hitShotColor: string;
  private hitShotContent: string;
  private shipDestroyedContent: string;

  constructor(
    private accountService: AccountService,
    private matchService: MatchService,
    private modalService: MdbModalService,
    private socketService: SocketService,
    private route: ActivatedRoute
  ) {
    this.rowField = new FormControl(null);
    this.colField = new FormControl(null);

    this.shipColor = 'gray';
    this.missedShotColor = '#1266f1';
    this.missedShotContent = '<i class="fas fa-water text-white"></i>';
    this.hitShotColor = '#f93154';
    this.hitShotContent = '<i class="fas fa-fire-alt text-white"></i>';
    this.shipDestroyedContent = '<i class="fas fa-times"></i>';
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.matchId = param['id'];
        this.initGrid();
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
            '<strong>X</strong>'
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
      },
    });
  }

  /**
   * Register socket events
   */
  private initSocketEvents(): void {
    this.socketService
      .shotFiredListener(this.matchId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (shot) => {
          // check if there is a winner
          this.winner();

          // if the shot was fired by the client
          if (shot.shooterUsername === this.accountService.getUsername()) {
            let shipHit: boolean = false;

            for (let ship of this.opponentPlayer.grid.ships) {
              for (let coordinate of ship.coordinates) {
                if (
                  shot.coordinates.row === coordinate.row &&
                  shot.coordinates.col === coordinate.col
                ) {
                  shipHit = true;
                  this.setCellType(
                    'table2',
                    coordinate.row,
                    coordinate.col,
                    ShotType.Hit
                  );
                  break;
                }
              }

              if (shipHit) break;
            }

            // shot missed
            if (!shipHit) {
              this.setCellType(
                'table2',
                shot.coordinates.row,
                shot.coordinates.col,
                ShotType.Missed
              );
            }
          }

          // the shot was fired by the opponent
          else {
            this.isMyTurn = true;

            this.setCellContent(
              'table1',
              shot.coordinates.row,
              shot.coordinates.col,
              '<strong>X</strong>'
            );
          }
        },
      });
  }

  /**
   *
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
    this.isMyTurn = match.turnOf === this.player.playerUsername ? true : false;
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
  private isWinningPlayer(player: Player): boolean {
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
        console.log('Ship destroyed', ship.shipType);
        totalShips--;
      }
    }

    return totalShips === 0 ? true : false;
  }

  /**
   *
   */
  private winner() {
    if (this.isWinningPlayer(this.player)) {
      console.log(this.player.playerUsername + ' won!');
    } else {
      if (this.isWinningPlayer(this.opponentPlayer)) {
        console.log(this.opponentPlayer.playerUsername + ' won!');
      }
    }
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
  public openChat = (): void => {
    this.modalService.open(ChatModalComponent, {
      data: { chatId: this.matchChatId },
      modalClass: 'modal-fullscreen modal-dialog-scrollable',
    });
  };

  /**
   *
   */
  public leaveMatch(): void {}

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
