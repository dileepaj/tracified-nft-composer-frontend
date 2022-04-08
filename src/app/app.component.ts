import { Component } from '@angular/core';
import { AuthService } from './services/authService/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tracified-nft-composer-frontend';
  authorized: boolean = true;
  constructor(private auth: AuthService) {}
  OnInit() {
    this.authorized = this.auth.isValidToken();
  }
}
