import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Grid } from 'src/app/models/Grid';
import { GridCoordinates } from 'src/app/models/GridCoordinates';
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
  private grid: Grid;
  private opponentGrid: Grid;
  public opponentUsername: string;
  private playersChatId: string;
  private chatModalRef: MdbModalRef<ChatModalComponent> | null;

  public rowField: FormControl;
  public colField: FormControl;

  public errorMessage: string;

  public startingPlayer: string;

  constructor(
    private accountService: AccountService,
    private matchService: MatchService,
    private modalService: MdbModalService,
    private socketService: SocketService,
    private route: ActivatedRoute
  ) {
    this.chatModalRef = null;
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
          // if the shot was fired by the client
          if (shot.shooterUsername === this.accountService.getUsername()) {
            let shipHit: boolean = false;
            for (let ship of this.grid.ships) {
              for (let coordinate of ship.coordinates) {
                if (
                  shot.coordinates.row === coordinate.row &&
                  shot.coordinates.col === coordinate.col
                ) {
                  shipHit = true;
                  this.changeCellColor(
                    'table2',
                    String(coordinate.row * 10 + coordinate.col),
                    '#A80000'
                  );
                }
              }
            }
          }

          // if the shot was fired by the opponent
          if (shot.shooterUsername === this.opponentUsername) {
            for (let ship of this.grid.ships) {
              for (let coordinate of ship.coordinates) {
                if (
                  shot.coordinates.row === coordinate.row &&
                  shot.coordinates.col === coordinate.col
                ) {
                  this.setFireShot(
                    'table1',
                    shot.coordinates.row,
                    shot.coordinates.col
                  );
                }
              }
            }
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
        let player: Player;
        let opponentPlayer: Player;

        if (
          match.player1.playerUsername === this.accountService.getUsername()
        ) {
          player = match.player1;
          opponentPlayer = match.player2;
        } else {
          player = match.player2;
          opponentPlayer = match.player1;
        }

        this.grid = player.grid;
        this.playersChatId = match.playersChat;
        this.opponentUsername = opponentPlayer.playerUsername;

        // set ships on primary grid
        for (let ship of this.grid.ships) {
          for (let coordinate of ship.coordinates) {
            this.changeCellColor(
              'table1',
              String(coordinate.row * 10 + coordinate.col),
              'gray'
            );
          }
        }

        // set shots received
        for (let shot of this.grid.shotsReceived) {
          this.setFireShot('table1', shot.row, shot.col);
        }

        //
        for (let shot of opponentPlayer.grid.shotsReceived) {
          let found: boolean = false;
          for (let ship of opponentPlayer.grid.ships) {
            for (let coordinate of ship.coordinates) {
              if (shot.row === coordinate.row && shot.col === coordinate.col) {
                found = true;
                this.changeCellColor(
                  'table2',
                  String(coordinate.row * 10 + coordinate.col),
                  '#A80000'
                );
              }
            }
          }
          if (!found) {
            this.changeCellColor(
              'table2',
              String(shot.row * 10 + shot.col),
              '#006994'
            );
          }
        }
      },
    });
  }

  public get rowValue() {
    return this.rowField.value;
  }

  public get colValue() {
    return this.colField.value;
  }

  /**
   * Change the background color of the table cell.
   * @param id the cell id
   */
  private changeCellColor(tableName: string, id: string, color: string): void {
    let td: HTMLElement | null = document.getElementById(tableName + id);
    if (td) td.style.background = color;
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
    if (td) td.innerHTML = '<strong>X</strong>';
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
   * Open the game chat.
   */
  public openChat(): void {
    this.chatModalRef = this.modalService.open(ChatModalComponent, {
      data: { chatId: this.playersChatId },
      modalClass: 'modal-fullscreen modal-dialog-scrollable',
    });
  }

  /**
   * Fire a shot.
   */
  public shoot(): void {
    this.errorMessage = null;

    const row: number = this.parseRow(this.rowValue);
    const col: number | any = this.colValue;

    if (!this.checkCoordinates(row, col)) {
      this.errorMessage = 'Invalid coordinates!';
      return;
    }

    const coordinates: GridCoordinates = { row, col };

    // fire the shot
    this.matchService
      .fireAShot(this.matchId, this.accountService.getUsername(), coordinates)
      .subscribe();
  }
}
