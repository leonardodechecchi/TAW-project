import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Grid } from 'src/app/models/Grid';
import { Player } from 'src/app/models/Player';
import { AccountService } from 'src/app/services/account.service';
import { MatchService } from 'src/app/services/match.service';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';

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

  constructor(
    private accountService: AccountService,
    private matchService: MatchService,
    private modalService: MdbModalService,
    private route: ActivatedRoute
  ) {
    this.chatModalRef = null;
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.matchId = param['id'];
        this.initGrid();
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

        console.log(match);

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
   */
  public openChat() {
    this.chatModalRef = this.modalService.open(ChatModalComponent, {
      data: { chatId: this.playersChatId },
      modalClass: 'modal-fullscreen modal-dialog-scrollable',
    });
  }
}
