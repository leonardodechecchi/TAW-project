import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatchStats } from 'src/app/models/Match';
import { AccountService } from 'src/app/services/account.service';
import { MatchService } from 'src/app/services/match.service';

@UntilDestroy()
@Component({
  selector: 'winner',
  templateUrl: './winner.component.html',
})
export class WinnerComponent implements OnInit {
  private matchId: string;
  public stats: MatchStats;
  public extras: NavigationExtras;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    public accountService: AccountService
  ) {
    this.stats = {
      winner: null,
      startTime: null,
      endTime: null,
      totalShots: 0,
    };

    this.extras = this.router.getCurrentNavigation().extras;
  }

  public ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.matchId = param['id'];

        this.matchService.getMatch(this.matchId).subscribe({
          next: (match) => {
            this.stats = match.stats;
          },
        });
      },
    });
  }

  /**
   * Navigate the user to the homepage.
   */
  public goBackToHomepage(): void {
    this.router.navigate(['home']);
  }
}
