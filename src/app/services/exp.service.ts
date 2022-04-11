import { Injectable } from '@angular/core';
import { JwtserviceService } from './jwtservice.service';
import * as jwt from 'jsonwebtoken';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ExpService {
  private exp: any;
  private currentExp: any;

  constructor(private jwtService: JwtserviceService, private router: Router) {}

  public checkExpire(): boolean {
    try {
      const decoded: any = jwt.decode(this.jwtService.getToken(), {
        complete: true,
      });

      if (decoded != null) {
        // console.log(decoded.payload);
        const currentUser = JSON.parse(JSON.stringify(decoded.payload));
        this.exp = decoded.payload['exp'];
        this.currentExp = this.jwtService.getExp();

        if (this.exp !== undefined && this.currentExp !== undefined) {
          const currentExp: number = Number(this.currentExp);
          const now: number = Math.floor(Date.now() / 1000);

          if (currentExp < now) {
            this.jwtService.destroyToken();
            return false;
          } else {
            return true;
          }
        }
      }
      return false;
    } catch (err) {
      return false;
    }
  }
}
