import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/authService/auth.service';
import { PopupMessageService } from '../services/popup-message/popup-message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: PopupMessageService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.auth.isValidToken()) {
      return this.auth.isValidToken();
    } else {
      this.snackBar.openSnackBar(
        'You do not have permission to NFT Composer'
      );
      this.router.navigate([`/login`]);
      return false;
    }
  }
}
