import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'positioning-phase-form',
  templateUrl: './positioning-phase-form.component.html',
})
export class PositioningPhaseFormComponent {
  @Input() shipType: string;
  @Input() shipsLeft: number;
  @Input() deployShip: (
    type: string,
    rowLetter: string,
    col: number,
    direction: string
  ) => boolean;

  public rowField: FormControl;
  public colField: FormControl;
  public direction: FormControl;

  constructor() {
    this.rowField = new FormControl(null, [Validators.required]);
    this.colField = new FormControl(null, [Validators.required]);
    this.direction = new FormControl('vertical');
  }

  public get rowValue() {
    return this.rowField.value;
  }

  public get colValue() {
    return this.colField.value;
  }

  public get directionValue() {
    return this.direction.value;
  }
}
