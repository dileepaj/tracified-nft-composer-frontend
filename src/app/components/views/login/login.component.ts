import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from 'src/app/entity/User';
import { AES } from 'crypto-js';
import { UserserviceService } from 'src/app/services/userservice.service';
import { Key } from 'src/app/entity/Variables';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { addUser } from 'src/app/store/user-state-store/user.action';
import jwt_decode from 'jwt-decode';
import { ComposerUser } from 'src/models/user';
import { timeout } from 'd3';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;
  public newPassword = 'none';
  public loginForm: FormGroup;
  sKey = 'hackerkaidagalbanisbaby'.split('').reverse().join('');
  public userToken: string;
  user: string;

  constructor(
    private router: Router,
    private _userService: UserserviceService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  public onSubmit(data: any) {
    const key: any = new Key();
    const user: UserLogin = new UserLogin();

    user.username = AES.encrypt(data.email, this.sKey).toString();
    user.password = AES.encrypt(data.password, this.sKey).toString();
    user.newPassword = AES.encrypt(
      this.newPassword.toString(),
      this.sKey
    ).toString();

    this._userService.login(user).subscribe({
      next: (data) => {
        sessionStorage.setItem('Token', data.Token);
        let decoded: any = jwt_decode(data.Token, { header: false });
        let user1: ComposerUser = {
          UserID: decoded.userID,
          UserName: decoded.username,
          Email: decoded.email,
          TenentId: decoded.tenantID,
          displayImage: decoded.displayImage,
          Company: decoded.company,
          Type: decoded.type,
          Country: decoded.locale,
          Domain: decoded.domain,
        };
        sessionStorage.setItem('User', JSON.stringify(user1));
        sessionStorage.setItem('authorized', 'authorized');
        this.user = decoded.userID;
        setTimeout(() => {
          this.router.navigate([`/projects/${this.user}`]);
        }, 6000);
      },
      error: (err) => {
        alert('Error!');
      },
    });
  }
}
