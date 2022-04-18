import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtserviceService } from './jwtservice.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private jwt: JwtserviceService) {}

  private api_url: String = '';
  private auth_token = this.jwt.getToken() || '';
  private sToken = 'Bearer ' + this.auth_token;

  /**
   * @function setHeaders - set headers for an API request
   * @param none
   */
  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.sToken.toString(),
    };

    return new HttpHeaders(headersConfig);
  }

  //GET request
  public get(path: string): Observable<any> {
    return this.http.get(`${this.api_url}${path}`, {
      headers: this.setHeaders(),
    });
  }

  //post request
  public post(path: string, body: any): Observable<any> {
    return this.http.post(`${this.api_url}${path}`, body, {
      headers: this.setHeaders(),
    });
  }
}
