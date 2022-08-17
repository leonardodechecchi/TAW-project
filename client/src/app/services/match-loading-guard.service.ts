import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { MatchService } from './match.service';

@Injectable({
  providedIn: 'root',
})
export class MatchLoadingGuardService implements CanActivate {
  private isLoading: boolean;

  constructor(private matchService: MatchService, private router: Router) {
    this.matchService.matchLoading.subscribe({
      next: (isLoading) => {
        this.isLoading = isLoading;
      },
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log(this.isLoading);
    if (this.isLoading) {
      this.router.navigate(['match', 'waiting-room']);
      return false;
    }
    return true;
  }
}
