import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'error-403',
  templateUrl: './error-403.component.html',
})
export class Error403Component {
  constructor(private router: Router) {}

  /**
   * Navigate the user to the homepage.
   */
  public goBackToLoginPage(): void {
    this.router.navigate(['auth']);
  }
}
