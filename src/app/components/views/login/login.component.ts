import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from 'src/app/entity/User';
import { AES } from 'crypto-js';
import { UserserviceService } from 'src/app/services/userservice.service';
import { Key } from 'src/app/entity/Variables';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { ExpService } from 'src/app/services/exp.service';
// import { JwtserviceService } from 'src/app/services/jwtservice.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email : String;
  password : String;
  public newPassword = 'none';
  public loginForm: FormGroup;

  constructor(
    private router: Router,
    // private jwtService: JwtserviceService,
    // private expService: ExpService,
    private _userService: UserserviceService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });

  }

  public onSubmit(data : any) {
    const key: any = new Key();
    const user: UserLogin = new UserLogin();
    // user.newPassword = 'U2FsdGVkX1+v3OvBPP3ZxZtCXtV8SsJGT6iku3cGTFc=';
    // user.password = 'U2FsdGVkX180nnyBaMdxC8D2S+QqpQQ16Xl7SEwH0qA=';
    // user.username =
    //   'U2FsdGVkX19rOQabUkIIQBv7e6voslG3hb76eJ8EUgFTP9ngqPq5o5mmLv2t8aBQ';

    user.username = AES.encrypt(data.email, key).toString();
    user.password = AES.encrypt(data.password, key).toString();
    user.newPassword = AES.encrypt(this.newPassword, key).toString();

    console.log('Username ', user.username);
    console.log('Password ', user.password);

    this._userService.login(user).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['/projects']);
      sessionStorage.setItem('authorized', 'authorized');
    });
  }
}
