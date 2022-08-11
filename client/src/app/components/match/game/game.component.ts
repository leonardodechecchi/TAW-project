import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Player } from 'src/app/models/Player';
import { AccountService } from 'src/app/services/account.service';
import { MatchService } from 'src/app/services/match.service';
import { SocketService } from 'src/app/services/socket.service';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';

@UntilDestroy()
@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  private matchId: string;
  private player: Player;
  private opponentPlayer: Player;
  public startingPlayer: string;
  private playersChatId: string;

  public rowField: FormControl;
  public colField: FormControl;

  public errorMessage: string;

  private missedShotColor: string = '#1c63cc';
  private hitShotColor: string = '#ec0930';

  constructor(
    private accountService: AccountService,
    private matchService: MatchService,
    private modalService: MdbModalService,
    private socketService: SocketService,
    private route: ActivatedRoute
  ) {
    this.rowField = new FormControl(null);
    this.colField = new FormControl(null);
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.matchId = param['id'];
        this.initSocketEvents();
        this.initGrid();
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
                  this.changeCellColor(
                    'table2',
                    this.getCellId(coordinate.row, coordinate.col),
                    this.hitShotColor
                  );
                  break;
                }
              }

              if (shipHit) break;
            }

            // shot missed
            if (!shipHit) {
              this.changeCellColor(
                'table2',
                this.getCellId(shot.coordinates.row, shot.coordinates.col),
                this.missedShotColor
              );
            }
          }

          // the shot was fired by the opponent
          else {
            this.setFireShot(
              'table1',
              shot.coordinates.row,
              shot.coordinates.col
            );
          }
        },
      });
  }

  /**
   * Initialize the grid
   */
  private initGrid(): void {
    this.matchService.getMatch(this.matchId).subscribe({
      next: (match) => {
        if (
          match.player1.playerUsername === this.accountService.getUsername()
        ) {
          this.player = match.player1;
          this.opponentPlayer = match.player2;
        } else {
          this.player = match.player2;
          this.opponentPlayer = match.player1;
        }

        this.playersChatId = match.playersChat;
        this.startingPlayer = match.startingPlayer;

        // set ships on primary grid
        for (let ship of this.player.grid.ships) {
          for (let coordinate of ship.coordinates) {
            this.changeCellColor(
              'table1',
              this.getCellId(coordinate.row, coordinate.col),
              'gray'
            );
          }
        }

        // set shots received
        for (let shot of this.player.grid.shotsReceived) {
          this.setFireShot('table1', shot.row, shot.col);
        }

        // set fired shots on secondary grid
        for (let shot of this.opponentPlayer.grid.shotsReceived) {
          let found: boolean = false;
          for (let ship of this.opponentPlayer.grid.ships) {
            for (let coordinate of ship.coordinates) {
              if (shot.row === coordinate.row && shot.col === coordinate.col) {
                found = true;
                this.changeCellColor(
                  'table2',
                  this.getCellId(coordinate.row, coordinate.col),
                  '#ec0930'
                );
              }
            }
          }
          if (!found) {
            this.changeCellColor(
              'table2',
              this.getCellId(shot.row, shot.col),
              '#1c63cc'
            );
          }
        }
      },
    });
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
   * Change the background color of the table cell.
   * @param id the cell id
   */
  private changeCellColor(tableName: string, id: string, color: string): void {
    let td: HTMLElement | null = document.getElementById(tableName + id);
    td.style.background = color;

    if (color === this.missedShotColor)
      td.innerHTML = '<i class="fas fa-water text-white"></i>';

    if (color === this.hitShotColor) {
      td.innerHTML = '<i class="fas fa-fire-alt text-white"></i>';
    }
  }

  /**
   *
   * @param tableName the table name
   * @param row the row index
   * @param col the col index
   */
  private setFireShot(tableName: string, row: number, col: number) {
    let td: HTMLElement | null = document.getElementById(
      tableName + (row * 10 + col)
    );
    td.innerHTML = '<strong>X</strong>';
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

      if (shipDestroyed) totalShips--;
    }

    return totalShips === 0 ? true : false;
  }

  /**
   *
   */
  private winner() {
    if (this.isWinningPlayer(this.player)) {
      console.log(this.player.playerUsername + ' won!');
    }

    if (this.isWinningPlayer(this.opponentPlayer)) {
      console.log(this.opponentPlayer.playerUsername + ' won!');
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
  public openChat(): void {
    this.modalService.open(ChatModalComponent, {
      data: { chatId: this.playersChatId },
      modalClass: 'modal-fullscreen modal-dialog-scrollable',
    });
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

    // fire the shot
    this.matchService
      .fireAShot(this.matchId, this.accountService.getUsername(), { row, col })
      .subscribe({
        error: (err) => {
          console.log(err);
          this.errorMessage = err.error;
        },
      });
  }
}
