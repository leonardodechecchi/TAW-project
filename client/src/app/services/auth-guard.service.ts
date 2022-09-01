import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      !this.accountService.getToken() ||
      !this.accountService.isTokenValid()
    ) {
      this.authService.logout();
      return false;
    } else if (
      !this.accountService.isAdmin() &&
      !this.accountService.isModerator() &&
      !this.accountService.isActive()
    ) {
      this.router.navigate(['access-denied']);
    }
    return true;
  }
}
