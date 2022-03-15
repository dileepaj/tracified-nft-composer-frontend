import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { Key } from '../entity/variable';
import { AES } from 'crypto-js';
import { enc } from 'crypto-js';

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
    } else if (environment.name == 'staging') {
      this.tokenName = 'STTOKEN';
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
      return AES.decrypt(this._cookieService.get(this.tokenName),this.key.key).toString(enc.Utf8);
    }
  }
}
