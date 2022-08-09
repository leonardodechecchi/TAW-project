import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Grid } from 'src/app/models/Grid';
import { GridCoordinates } from 'src/app/models/GridCoordinates';
import { Player } from 'src/app/models/Player';
import { Ship, ShipTypes } from 'src/app/models/Ship';
import { AccountService } from 'src/app/services/account.service';
import { MatchService } from 'src/app/services/match.service';
import { SocketService } from 'src/app/services/socket.service';

@UntilDestroy()
@Component({
  selector: 'positioning-phase',
  templateUrl: './positioning-phase.component.html',
  styleUrls: ['./positioning-phase.component.scss'],
})
export class PositioningPhaseComponent implements OnInit {
  private matchId: string;
  public grid: Grid;
  public matchLoading: boolean;

  public errorMessage: string;
  public infoMessage: string;

  public destroyerCount: number;
  public cruiserCount: number;
  public battleshipCount: number;
  public carrierCount: number;

  constructor(
    private accountService: AccountService,
    private matchService: MatchService,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private router: Router
  ) {
    this.matchLoading = false;

    this.destroyerCount = 5;
    this.cruiserCount = 3;
    this.battleshipCount = 2;
    this.carrierCount = 1;
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.matchId = param['id'];
        this.initSocketEvents();
        this.initMatch();
      },
    });

    this.matchService.matchLoading.pipe(untilDestroyed(this)).subscribe({
      next: (matchLoading) => {
        this.matchLoading = matchLoading;
      },
    });
  }

  /**
   * Register socket events
   */
  private initSocketEvents(): void {
    // when players are ready
    this.socketService
      .positioningCompleted()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          console.log('positioning-completed!');
          this.matchService.updateMatchLoading(false);
          this.router.navigate(['../game']);
        },
      });

    // when the opponent is ready
    this.socketService
      .playerStateChanged()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          console.log('player-state-changed');
          this.infoMessage = 'Your opponent is ready to play!';
        },
      });
  }

  /**
   * Initialize the grid
   */
  private initMatch(): void {
    this.matchService.getMatch(this.matchId).subscribe({
      next: (match) => {
        const userUsername: string = this.accountService.getUsername();
        const player: Player =
          match.player1.playerUsername === userUsername
            ? match.player1
            : match.player2;

        this.grid = player.grid;

        for (let ship of this.grid.ships) {
          this.decreaseShipCount(ship.shipType);
          for (let coordinate of ship.coordinates) {
            this.changeCellColor(String(coordinate.row * 10 + coordinate.col));
          }
        }
      },
    });
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
   * Return the length of the ship.
   * @param shipType the ship type
   * @returns the ship length
   */
  private getShipLength(shipType: ShipTypes): number {
    switch (shipType) {
      case ShipTypes.Destroyer:
        return 2;
      case ShipTypes.Cruiser:
        return 3;
      case ShipTypes.Battleship:
        return 4;
      default:
        return 5;
    }
  }

  /**
   * Decrease the number of the ship.
   * @param shipType the ship type
   */
  private decreaseShipCount(shipType: ShipTypes): void {
    switch (shipType) {
      case ShipTypes.Destroyer:
        this.destroyerCount--;
        break;
      case ShipTypes.Cruiser:
        this.cruiserCount--;
        break;
      case ShipTypes.Battleship:
        this.battleshipCount--;
        break;
      default:
        this.carrierCount--;
    }
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
   * Check if the given coordinates are correct.
   * @param row the row index
   * @param col the col index
   */
  private checkCoordinates(row: number, col: number): boolean {
    // nullify error message
    this.errorMessage = null;

    // check if the coordinates are numbers
    if (isNaN(row) || isNaN(col)) {
      this.errorMessage = 'Error: not a number';
      return false;
    }

    // check if the coordinates are out of bounds
    if (row < 0 || row > 9 || col < 0 || col > 9) {
      this.errorMessage = 'Error: index out of bounds';
      return false;
    }

    for (let ship of this.grid.ships) {
      for (let coordinate of ship.coordinates) {
        // check overlapping
        if (coordinate.row === row && coordinate.col === col) {
          this.errorMessage = 'Error: the ship overlaps another ship';
          return false;
        }

        // check if the ship is too close
        if (
          (coordinate.row === row + 1 && coordinate.col === col + 1) ||
          (coordinate.row === row - 1 && coordinate.col === col - 1) ||
          (coordinate.row === row + 1 && coordinate.col === col - 1) ||
          (coordinate.row === row - 1 && coordinate.col === col + 1) ||
          (coordinate.row === row + 1 && coordinate.col === col) ||
          (coordinate.row === row && coordinate.col === col + 1) ||
          (coordinate.row === row - 1 && coordinate.col === col) ||
          (coordinate.row === row && coordinate.col === col - 1)
        ) {
          this.errorMessage = 'Error: the ship is too close to another ship';
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Insert a ship into the grid.
   * @param type the ship type
   * @param rowLetter the row letter, i.e. `A`, `B`, `C`, ...
   * @param col the column index
   * @param direction the ship direction, i.e. `Vertical` or `Horizontal`
   */
  public deployShip = (
    type: string,
    rowLetter: string,
    col: number,
    direction: string
  ): boolean => {
    const row: number = this.parseRow(rowLetter);

    if (!this.checkCoordinates(row, col)) return;

    let shipType: ShipTypes = ShipTypes[type as keyof typeof ShipTypes];
    let shipLength: number = this.getShipLength(shipType);
    let coordinates: GridCoordinates[] = [];

    // add VERTICAL ship
    if (
      direction === 'vertical' &&
      this.checkCoordinates(row + (shipLength - 1), col)
    ) {
      // check if the ship is not close to another ship
      for (let idx = 0; idx < shipLength; idx++) {
        if (!this.checkCoordinates(row + idx, col)) return false;
      }

      // add coordinates
      for (let idx = 0; idx < shipLength; idx++) {
        this.changeCellColor(String((row + idx) * 10 + col));
        coordinates.push({ row: row + idx, col });
      }

      // create the ship
      const ship: Ship = { shipType, coordinates };
      this.grid.ships.push(ship);

      // delete the just added ship
      this.decreaseShipCount(shipType);
    }

    // add HORIZONTAL ship
    else {
      for (let idx = 0; idx < shipLength; idx++) {
        if (!this.checkCoordinates(row, col + idx)) return false;
      }

      for (let idx = 0; idx < shipLength; idx++) {
        this.changeCellColor(String(row * 10 + (col + idx)));
        coordinates.push({ row, col: col + idx });
      }

      const ship: Ship = { shipType, coordinates };
      this.grid.ships.push(ship);

      this.decreaseShipCount(shipType);
    }

    // update player grid
    this.matchService
      .updatePlayerGrid(
        this.matchId,
        this.accountService.getUsername(),
        this.grid
      )
      .subscribe();
    return true;
  };

  /**
   *
   */
  public reset(): void {
    // reset the number of ships
    this.destroyerCount = 5;
    this.cruiserCount = 3;
    this.battleshipCount = 2;
    this.carrierCount = 1;

    // reset the grid
    this.grid = {
      ships: [],
      shotsReceived: [],
    };
    this.matchService.updatePlayerGrid(
      this.matchId,
      this.accountService.getUsername(),
      this.grid
    );

    // reset the table cell colors
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        let cell: HTMLElement | null = document.getElementById(
          String(row * 10 + col)
        );
        if (cell) cell.style.background = 'white';
      }
    }
  }

  /**
   *
   */
  public ready(): void {
    if (
      this.destroyerCount !== 0 ||
      this.cruiserCount !== 0 ||
      this.battleshipCount !== 0 ||
      this.carrierCount !== 0
    ) {
      this.errorMessage = 'Not all ships are deployed';
      return;
    }

    // update player status
    this.matchService.updateMatchLoading(true);
    this.matchService
      .setPlayerReady(this.matchId, this.accountService.getUsername(), true)
      .subscribe();
  }
}
