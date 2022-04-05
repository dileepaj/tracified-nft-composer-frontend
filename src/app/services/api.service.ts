import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private api_url: String = '';
  private auth_token = sessionStorage.getItem('Token') || '';
  private sToken = 'Bearer ' + this.auth_token;

  constructor(private http: HttpClient) {}

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
  get(path: string): Observable<any> {
    return this.http.get(`${this.api_url}${path}`, {
      headers: this.setHeaders(),
    });
  }

  //post request
  post(path: string, body: any): Observable<any> {
    return this.http.post(`${this.api_url}${path}`, body, {
      headers: this.setHeaders(),
    });
  }
}
