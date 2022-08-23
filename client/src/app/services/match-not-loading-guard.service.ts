import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { MatchService } from './match.service';

@Injectable({
  providedIn: 'root',
})
export class MatchNotLoadingGuardService implements CanActivate {
  private isLoading: boolean;

  constructor(private matchService: MatchService, private location: Location) {
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
    if (!this.isLoading) {
      this.location.back();
      return false;
    }
    return true;
  }
}
