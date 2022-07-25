import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'back-navbar',
  templateUrl: './back-navbar.component.html',
})
export class BackNavbarComponent {
  constructor(public location: Location, private router: Router) {}

  getCurrentUrl(): string {
    let url: string = this.router.url;
    return url.charAt(1).toUpperCase() + url.slice(2);
  }
}
