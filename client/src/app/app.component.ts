import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SocketService } from './services/socket.service';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'Battleship';
  public token: string;

  constructor() {}

  ngOnInit(): void {}
}
