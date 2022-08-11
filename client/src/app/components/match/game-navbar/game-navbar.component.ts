import { Component, Input } from '@angular/core';

@Component({
  selector: 'game-navbar',
  templateUrl: './game-navbar.component.html',
})
export class GameNavbarComponent {
  @Input() openChat: () => void;
  @Input() opponentUsername: string;

  constructor() {}
}
