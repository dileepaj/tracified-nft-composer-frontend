import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from 'src/app/entity/User';
import { AES } from 'crypto-js';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtserviceService } from 'src/app/services/jwtservice.service';
import jwt_decode from 'jwt-decode';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { AuthService } from 'src/app/services/authService/auth.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { UserserviceService } from 'src/app/services/userservice.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { addUsername } from 'src/app/store/user-state-store/user.action';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public newPassword = 'none';
  public loginForm: FormGroup;
  sKey = 'hackerkaidagalbanisbaby'.split('').reverse().join('');
  public userToken: string;
  public loading = false;
  constructor(
    private router: Router,
    private _authService: AuthService,
    private jwt: JwtserviceService,
    private snackBar: PopupMessageService,
    private mediaObserver: MediaObserver,
    private userService: UserserviceService,
    private store: Store<AppState>
  ) {}

  //for create responsive Ui
  mediaSub: Subscription;
  deviceXs: boolean;

  ngOnInit(): void {
    //for create responsive Ui
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.deviceXs = result.mqAlias === 'xs' ? true : false;
      }
    );

    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onDestroy() {
    //for create responsive Ui
    this.mediaSub.unsubscribe();
  }

  public onSubmit() {
    this.loading = true;
    const user: UserLogin = new UserLogin();
    if (this.loginForm.status == 'VALID') {
      user.username = AES.encrypt(
        this.loginForm.value.username,
        this.sKey
      ).toString();
      user.password = AES.encrypt(
        this.loginForm.value.password,
        this.sKey
      ).toString();
      user.newPassword = AES.encrypt(
        this.newPassword.toString(),
        this.sKey
      ).toString();

      this._authService.login(user).subscribe({
        complete: () => {
          this.loading = false;
        },
        next: (data) => {
          this.jwt.saveToken(data);
          let decoded: any = jwt_decode(data.Token, { header: false });
          let username = JSON.parse(sessionStorage.getItem('User') || '')
            .UserName!;
          this.store.dispatch(addUsername({ username: username }));
          if (!!decoded.userID)
            this.router.navigate([`/layout/projects/${decoded.userID}`]);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.openSnackBar('Invalid email or password');
        },
      });
    } else {
      this.loading = false;
      this.snackBar.openSnackBar('Invalid Input');
    }
  }
}
