import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/authService/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tracified-nft-composer-frontend';
  authorized: boolean = true;
  constructor(private auth: AuthService, private router: Router) {}
  OnInit() {
    this.authorized = this.auth.isValidToken();
  }

  isLogIn() {
    if (this.router.url === '/login') {
      return true;
    } else {
      return false;
    }
  }
}
