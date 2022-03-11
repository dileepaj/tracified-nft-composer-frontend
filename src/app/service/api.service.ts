import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enc } from 'crypto-js';
// import { URLSearchParams } from 'url';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private api_url: String = '';
  private auth_token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6IiIsImFkZHJlc3MiOnsiZm9ybWF0dGVkIjoibm9uZSJ9LCJhdXRoX3RpbWUiOjE2NDY4MTEyMjYsImJhY2tlbmRWZXJzaW9uIjoidjEiLCJjb21wYW55IjoiUUEiLCJkZXZpY2VJZCI6IjQxNWY2ZjUwLTlmN2ItMTFlYy04MzJhLTM5MmU2YmEwOTJiNSIsImRpc3BsYXlJbWFnZSI6Im5vbmUiLCJkb21haW4iOiJBZ3JpY3VsdHVyZSIsImVtYWlsIjoidGhpbnVyaXdAdHJhY2lmaWVkLmNvbSIsImxvY2FsZSI6IlNyaSBMYW5rYSIsIm5hbWUiOiJRQSAiLCJwZXJtaXNzaW9ucyI6eyIwIjpbIjEwIiwiMTIiLCIxNyIsIjYwIiwiMTgiLCI0MSIsIjQyIiwiNjciLCI2OCIsIjYxIiwiMTkiLCI0MyIs…sIjM3IiwiMzgiLCIzOSIsIjY0IiwiNTQiLCI1NSIsIjU2IiwiNjUiLCI1NyIsIjU4IiwiNTkiLCI2MCIsIjYxIiwiNjIiLCI2MyIsIjY0IiwiNjUiLCI2NyIsIjY4IiwiNjkiLCI3MCIsIjczIl19LCJwaG9uZV9udW1iZXIiOiIrOTQ3NzAzMTkxNjIiLCJwaWQiOiIiLCJ0ZW5hbnRJRCI6Ijc4NGI1MDcwLTgyNDgtMTFlYi1iY2FjLTMzOTQ1NGE5OTZiZSIsInRlbmFudFR5cGUiOjAsInR5cGUiOiJBZG1pbiIsInVzZXJJRCI6Ijc4NGI1MDcwLTgyNDgtMTFlYi1iY2FjLTMzOTQ1NGE5OTZiZSIsInVzZXJuYW1lIjoidGhpbnVyaXdAdHJhY2lmaWVkLmNvbSIsImlhdCI6MTY0NjgxMTIyNiwiZXhwIjoxNjQ3NDE2MDI2fQ.SAtPC-dPebvlrWENWWaAOXWz0GaxKbgQeJjGlS8fj6w';

  constructor(private http: HttpClient) {}

  /**
   * @function setHeaders - set headers for an API request
   * @param none
   */
  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.auth_token.toString(),
    };

    return new HttpHeaders(headersConfig);
  }

  //GET requests
  get(
    path: string
    // params: URLSearchParams = new URLSearchParams()
  ): Observable<any> {
    return this.http.get(`${this.api_url}${path}`, {
      headers: this.setHeaders(),
      // search : params,
    });
  }
}
