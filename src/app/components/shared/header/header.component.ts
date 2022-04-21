import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { JwtserviceService } from 'src/app/services/jwtservice.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { AppState } from 'src/app/store/app.state';
import {
  selectUserDetail,
  selectUserName,
} from 'src/app/store/user-state-store/user.selector';
import { ComposerUser } from 'src/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: ComposerUser;
  constructor(
    private router: Router,
    private sidenav: SidenavService,
private userServices:UserserviceService,
private jwtServices:JwtserviceService
  ) {}

  ngOnInit(): void {
 this.user=this.userServices.getCurrentUser()
  }

  public logout() {
    this.router.navigate(['/login']);
    sessionStorage.setItem('Token', '');
  }

  public toggleSideBar() {
    this.sidenav.toggleNav();
    this.user = this.userServices.getCurrentUser();
  }

  public isProjectsView() {
    let tenentId = JSON.parse(sessionStorage.getItem('User') || '').TenentId!;
    if (this.router.url === `/layout/projects/${tenentId}`) {
      return true;
    } else {
      return false;
    }
  }
}
