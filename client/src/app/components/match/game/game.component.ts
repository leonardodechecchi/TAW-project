import { Component, OnDestroy, OnInit } from '@angular/core';
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
  private playersChatId: string;
  private chatModalRef: MdbModalRef<ChatModalComponent> | null;

  public rowField: FormControl;
  public colField: FormControl;

  public errorMessage: string;

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
      .shotFired(this.matchId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (coordinates) => {
          console.log(coordinates);
        },
      });
  }

  /**
   * Initialize the grid
   */
  private initGrid(): void {
    this.matchService.getMatch(this.matchId).subscribe({
      next: (match) => {
        const userUsername: string = this.accountService.getUsername();
        const player: Player =
          match.player1.playerUsername === userUsername
            ? match.player1
            : match.player2;

        this.grid = player.grid;
        this.playersChatId = match.playersChat;

        for (let ship of this.grid.ships) {
          for (let coordinate of ship.coordinates) {
            this.changeCellColor(String(coordinate.row * 10 + coordinate.col));
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
  private changeCellColor(id: string): void {
    let td: HTMLElement | null = document.getElementById(id);
    if (td) td.style.background = 'gray';
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

  /**
   *
   * @param row
   * @param col
   * @returns
   */
  private checkCoordinates(row: number, col: number): boolean {
    if (isNaN(row) || isNaN(col)) return false;
    if (row < 0 || row > 9 || col < 0 || col > 9) return false;
    return true;
  }

  /**
   *
   */
  public openChat(): void {
    this.chatModalRef = this.modalService.open(ChatModalComponent, {
      data: { chatId: this.playersChatId },
      modalClass: 'modal-fullscreen modal-dialog-scrollable',
    });
  }

  /**
   *
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
