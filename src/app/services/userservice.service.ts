import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BToken } from '../entity/artifact';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserserviceService {
  private admin: any;

  constructor(private apiService: ApiService, private router: Router) {
    this.admin = environment.adminUrl;
  }

  public getCurrentUser(): any {
    if (!!sessionStorage.getItem('User'))
      return JSON.parse(sessionStorage.getItem('User') || '');
    else 
      this.router.navigate([`/login`]);
  }
}
