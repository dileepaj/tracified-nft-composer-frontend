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
  
  public getUser(): Observable<any> {
    return this.apiService.get(this.admin + '/api/bc/user');
  }
}
