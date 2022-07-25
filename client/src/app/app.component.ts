import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'Battleship';
  public token: string;

  constructor(private router: Router) {}

  /**
   * Check if the router url contains the specified route
   *
   * @param {string} regexp
   * @returns
   * @memberof BackNavbarComponent
   */
  hasRoute(regexp: string): boolean {
    return !!this.router.url.match(regexp);
  }
}
