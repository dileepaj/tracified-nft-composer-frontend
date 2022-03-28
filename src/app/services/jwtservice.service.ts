import { Injectable } from '@angular/core';
import * as jwt from 'jsonwebtoken';
import { Key } from '../entity/Variables';
import { CookieService } from 'ngx-cookie-service';
import * as MomentAll from 'moment';
import { environment } from '../../environments/environment';
import { AES, enc } from 'crypto-js';


@Injectable({
  providedIn: 'root',
})
export class JwtserviceService {
  private tokenName: string;
  private expName: string;
  private domain: string;

  constructor(private _cookieService: CookieService) {
    console.log(environment);
    if (environment.name == 'production') {
      this.tokenName = 'PTTOKEN';
      this.expName = 'PWAIT';
    } else if (environment.name == 'staging') {
      this.tokenName = 'STTOKEN';
      this.expName = 'SWAIT';
    } else if (environment.name == 'qa') {
      this.tokenName = 'QATOKEN';
      this.expName = 'QWAIT';
    }
    this.domain = environment.domain;
  }

  key = new Key();
  public getToken(): string {
    if (!this._cookieService.check(this.tokenName)) {
      return '';
    } else {
      return AES.decrypt(
        this._cookieService.get(this.tokenName),
        this.key.key
      ).toString(enc.Utf8);
    }
  }

  public isEmpty(): boolean {
    if (this._cookieService.check(this.tokenName)) {
      return true;
    } else {
      return false;
    }
  }

  public saveToken(token: string) {
    const decoded: any = jwt.decode(token);
    const currentUser = JSON.parse(JSON.stringify(decoded));
    this.setExp(decoded['exp']);

    const expireDate = MomentAll().add(1, 'd').toDate();
    this._cookieService.set(
      this.tokenName,
      AES.encrypt(token, this.key.key).toString(),
      expireDate,
      '/',
      this.domain
    );
  }

  public destroyToken() {
    const expireDate = MomentAll().add(30, 'y').toDate();
    this._cookieService.set(this.tokenName, '', expireDate, '/', this.domain);
    this._cookieService.set(this.expName, '', expireDate, '/', this.domain);
  }

  public setExp(exp: string) {
    const expirehours = MomentAll().add(1, 'd').toDate();
    this._cookieService.set(
      this.expName,
      AES.encrypt(exp.toString(), this.key.key).toString(),
      expirehours,
      '/',
      this.domain
    );
  }

  public getExp(): string {
    if (this._cookieService.check(this.expName)) {
      return AES.decrypt(this._cookieService.get(this.expName), this.key.key)
        .toString(enc.Utf8)
        .toString();
    } else {
      return '00000';
    }
  }
}
