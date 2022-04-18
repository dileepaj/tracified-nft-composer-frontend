import { Injectable } from '@angular/core';
import { JwtserviceService } from '../jwtservice.service';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private admin: any;
  constructor(private jwt: JwtserviceService, private apiService: ApiService) {
    this.admin = environment.adminUrl;
  }

  public isValidToken(): boolean {
    if (this.jwt.isEmpty() || Date.now() >= Number(this.jwt.getExp()) * 1000) {
      let decoded: any = jwt_decode(this.jwt.getToken(), { header: false });
      if (
        !!decoded.permissions &&
        !!decoded.permissions[0] &&
        !!decoded.tenantID &&
        !!decoded.username &&
        decoded.permissions[0].includes('10')
      )
        return true;
      else return false;
    } else {
      return false;
    }
  }
  public login(credentials: any): Observable<any> {
    console.log('Login api called');
    return this.apiService.post(this.admin + '/sign/login', {
      user: credentials,
    });
  }
}
