import { Component, Input } from '@angular/core';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
  @Input() parseRow: (letter: string) => number;
  @Input() tableName: string;

  constructor() {}
}
