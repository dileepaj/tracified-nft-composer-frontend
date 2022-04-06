import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from 'src/app/entity/User';
import { AES } from 'crypto-js';
import { Key } from 'src/app/entity/Variables';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtserviceService } from 'src/app/services/jwtservice.service';
import jwt_decode from 'jwt-decode';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { AuthService } from 'src/app/services/authService/auth.service';
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
    private snackBar: PopupMessageService
  ) {}

  ngOnInit(): void {
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

  public onSubmit() {
        this.loading = true;
    console.log('loginForm', this.loginForm);
    const key: any = new Key();
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
        complete:()=>{
          this.loading=false
        },
        next: (data) => {
          this.jwt.saveToken(data);
          let decoded: any = jwt_decode(data.Token, { header: false });
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