import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../entity/artifact';

@Injectable({
  providedIn: 'root',
})
export class UserserviceService {

  private admin: any;

  constructor(private apiService: ApiService) {
      this.admin = environment.adminUrl;
  }

  public login(credentials : any) : Observable<any> {
    console.log("Login api called");
    return this.apiService.post(this.admin + '/sign/login', {user : credentials});
  }
}