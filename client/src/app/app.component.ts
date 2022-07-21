import { Component, OnInit } from '@angular/core';
import { Token } from './models/Token';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'Battleship';
  public token: string;

  constructor(public accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.token.subscribe({
      next: (token) => {
        this.token = token;
      },
    });
  }
}
