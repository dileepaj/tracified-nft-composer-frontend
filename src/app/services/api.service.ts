import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private api_url: String = '';
  private auth_token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6IiIsImFkZHJlc3MiOnsiZm9ybWF0dGVkIjoibm9uZSJ9LCJhdXRoX3RpbWUiOjE2NDcyNDgyOTAsImJhY2tlbmRWZXJzaW9uIjoidjEiLCJjb21wYW55IjoiUUEiLCJkZXZpY2VJZCI6ImRmZDIwNmEwLWEzNzQtMTFlYy04MzJhLTM5MmU2YmEwOTJiNSIsImRpc3BsYXlJbWFnZSI6Im5vbmUiLCJkb21haW4iOiJBZ3JpY3VsdHVyZSIsImVtYWlsIjoidGhpbnVyaXdAdHJhY2lmaWVkLmNvbSIsImxvY2FsZSI6IlNyaSBMYW5rYSIsIm5hbWUiOiJRQSAiLCJwZXJtaXNzaW9ucyI6eyIwIjpbIjEwIiwiMTIiLCIxNyIsIjYwIiwiMTgiLCI0MSIsIjQyIiwiNjciLCI2OCIsIjYxIiwiMTkiLCI0MyIsIjQ0IiwiNjIiLCIyMCIsIjQ1IiwiNDYiLCI2MyIsIjIxIiwiNDciLCI0OCIsIjIyIiwiMjMiLCIyNCIsIjI1IiwiMjYiLCIyNyIsIjI4IiwiNDAiLCIyOSIsIjUwIiwiMzAiLCIzMSIsIjQ5IiwiNTMiLCIzMiIsIjUxIiwiNTIiLCIzMyIsIjM0IiwiMzUiLCIzNiIsIjM3IiwiMzgiLCIzOSIsIjY0IiwiNTQiLCI1NSIsIjU2IiwiNjUiLCI1NyIsIjU4IiwiNTkiLCI2MCIsIjYxIiwiNjIiLCI2MyIsIjY0IiwiNjUiLCI2NyIsIjY4IiwiNjkiLCI3MCIsIjczIl19LCJwaG9uZV9udW1iZXIiOiIrOTQ3NzAzMTkxNjIiLCJwaWQiOiIiLCJ0ZW5hbnRJRCI6Ijc4NGI1MDcwLTgyNDgtMTFlYi1iY2FjLTMzOTQ1NGE5OTZiZSIsInRlbmFudFR5cGUiOjAsInR5cGUiOiJBZG1pbiIsInVzZXJJRCI6Ijc4NGI1MDcwLTgyNDgtMTFlYi1iY2FjLTMzOTQ1NGE5OTZiZSIsInVzZXJuYW1lIjoidGhpbnVyaXdAdHJhY2lmaWVkLmNvbSIsImlhdCI6MTY0NzI0ODI5MCwiZXhwIjoxNjQ3ODUzMDkwfQ.mDlwXWYmQCQWmP1QPDGcn-fsAuPigp-XS_M0sCPhP14';
  private sToken = 'Bearer ' + this.auth_token;

  constructor(private http: HttpClient) {}

  /**
   * @function setHeaders - set headers for an API request
   * @param none
   */
  private setHeaders(): HttpHeaders {
    console.log(this.auth_token);

    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.sToken.toString(),
    };
    console.log('Headers added ', headersConfig);

    return new HttpHeaders(headersConfig);
  }

  //GET requests
  get(
    path: string
    // params: URLSearchParams = new URLSearchParams()
  ): Observable<any> {
    console.log('main get');
    return this.http.get(`${this.api_url}${path}`, {
      headers: this.setHeaders(),
      // search : params,
    });
  }
}
