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
   *
   * @param routes
   * @returns
   */
  public hasRoute(routes: string[]): boolean {
    const currentRoute: string[] = this.router.url.split('/');
    for (let route of routes) {
      if (currentRoute.includes(route)) return true;
    }
    return false;
  }
}
