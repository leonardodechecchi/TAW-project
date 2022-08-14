import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/models/Player';
import { SocketService } from 'src/app/services/socket.service';

enum ShotType {
  Hit = 'Hit',
  Missed = 'Missed',
}

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  @Input() parseRow: (letter: string) => number;
  @Input() tableName: string;

  @Input() player: Player;
  @Input() opponentPlayer: Player;

  private shipColor: string;
  private fireShotContent: string;
  private missedShotColor: string;
  private missedShotContent: string;
  private hitShotColor: string;
  private hitShotContent: string;
  private shipDestroyedContent: string;

  constructor(private socketService: SocketService) {
    this.shipColor = 'gray';
    this.fireShotContent = '<i class="fas fa-times"></i>';
    this.missedShotColor = '#1266f1';
    this.missedShotContent = '<i class="fas fa-water text-white"></i>';
    this.hitShotColor = '#f93154';
    this.hitShotContent = '<i class="fas fa-fire text-white"></i>';
    this.shipDestroyedContent = '<i class="fas fa-times text-white"></i>';
  }

  ngOnInit(): void {}

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
}
