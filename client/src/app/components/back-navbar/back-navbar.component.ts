import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'back-navbar',
  templateUrl: './back-navbar.component.html',
})
export class BackNavbarComponent {
  constructor(private location: Location) {}

  public back(): void {
    this.location.back();
  }
}
