import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { MatchService } from 'src/app/services/match.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private matchService: MatchService,
    private router: Router
  ) {}

  public ngOnInit(): void {}

  /**
   * Search for a match.
   */
  public searchForAMatch(): void {
    // update match loading behavior subject
    this.matchService.updateMatchLoading(true);

    // post request to enter queue list
    this.matchService.searchForAMatch(this.accountService.getId()).subscribe({
      next: () => {
        // navigate to waiting room component
        this.router.navigate(['match', 'waiting-room']);
      },
    });
  }
}
