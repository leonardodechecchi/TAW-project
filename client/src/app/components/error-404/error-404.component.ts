import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'error-404',
  templateUrl: './error-404.component.html',
})
export class Error404Component {
  constructor(private router: Router) {}

  /**
   * Navigate the user to the homepage.
   */
  public goBackToHomepage(): void {
    this.router.navigate(['home']);
  }
}
