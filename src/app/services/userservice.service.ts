import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BToken } from '../entity/artifact';

@Injectable({
  providedIn: 'root',
})
export class UserserviceService {
  private admin: any;

  constructor(private apiService: ApiService) {
    this.admin = environment.adminUrl;
  }

  public login(credentials: any): Observable<any> {
    console.log('Login api called');
    return this.apiService.post(this.admin + '/sign/login', {
      user: credentials,
    });
  }

  public getUser(): Observable<any> {
    return this.apiService.get(this.admin + '/api/bc/user');
  }
}
