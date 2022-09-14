import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BToken } from '../entity/artifact';
import { JwtserviceService } from 'src/app/services/jwtservice.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserserviceService {
  private admin: any;

  constructor(private apiService: ApiService, private router: Router,private jwt: JwtserviceService) {
    this.admin = environment.adminUrl;
  }

  public getCurrentUser(): any {
    if (!!this.jwt.getUser().UserID) {
      return this.jwt.getUser();
    } else this.router.navigate([`/login`]);
  }
}
