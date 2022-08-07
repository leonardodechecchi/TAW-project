import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Grid } from 'src/app/models/Grid';
import { GridCoordinates } from 'src/app/models/GridCoordinates';
import { Ship, ShipTypes } from 'src/app/models/Ship';
import { AccountService } from 'src/app/services/account.service';
import { MatchService } from 'src/app/services/match.service';

@Component({
  selector: 'match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {
  private matchId: string;
  public grid: Grid;
  public playerReady: boolean;

  public errorMessage: string;

  public destroyerCount: number;
  public cruiserCount: number;
  public battleshipCount: number;
  public carrierCount: number;

  constructor(
    private accountService: AccountService,
    private matchService: MatchService,
    private route: ActivatedRoute
  ) {
    this.grid = {
      ships: [],
      shotsReceived: [],
    };

    this.playerReady = false;

    this.destroyerCount = 5;
    this.cruiserCount = 3;
    this.battleshipCount = 2;
    this.carrierCount = 1;
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.matchId = param['id'];
      },
    });
  }

  /**
   *
   * @param letter the letter to parse
   * @returns the corresponding number index
   */
  public parseRow(letter: string): number {
    switch (letter) {
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
    }
  }

  /**
   * Check if the given coordinates are correct.
   * @param row the row index
   * @param col the col index
   */
  private checkCoordinates(row: number, col: number): boolean {
    // check if the coordinates are numbers
    if (isNaN(row) || isNaN(col)) {
      this.errorMessage = 'not a number';
      return false;
    }

    // check if the coordinates are out of bounds
    if (row < 0 || row > 9 || col < 0 || col > 9) {
      this.errorMessage = 'index out of bounds';
      return false;
    }

    for (let ship of this.grid.ships) {
      for (let coordinate of ship.coordinates) {
        // check overlapping
        if (coordinate.row === row && coordinate.col === col) {
          this.errorMessage = 'the ship overlaps another ship';
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
          this.errorMessage = 'the ship is too close to another ship';
          return false;
        }
      }
    }
    return true;
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
   *
   * @param shipType
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

  private changeCellColor(id: string): void {
    let td: HTMLElement | null = document.getElementById(id);
    if (td) td.style.background = 'gray';
  }

  /**
   *
   * @param type
   * @param rowLetter
   * @param col
   * @param direction
   */
  public deployShip = (
    type: string,
    rowLetter: string,
    col: number,
    direction: string
  ): boolean => {
    this.errorMessage = null;
    let row = this.parseRow(rowLetter);

    if (!this.checkCoordinates(row, col)) return;

    let shipType: ShipTypes = ShipTypes[type as keyof typeof ShipTypes];
    let shipLength: number = this.getShipLength(shipType);
    let coordinates: GridCoordinates[] = [];

    // add vertical ship
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
      return true;
    }

    // add horizontal ship
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
      return true;
    }
  };

  /**
   *
   */
  public ready(): void {
    this.matchService
      .updatePlayerGrid(
        this.matchId,
        this.accountService.getUsername(),
        this.grid
      )
      .subscribe({
        next: () => {
          this.playerReady = true;
        },
      });
  }
}
