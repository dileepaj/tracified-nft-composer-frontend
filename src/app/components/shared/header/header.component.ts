import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidenavService } from 'src/app/services/sidenav.service';
import { AppState } from 'src/app/store/app.state';
import {
  selectUserDetail,
  selectUserName,
} from 'src/app/store/user-state-store/user.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userName: string = '';
  constructor(
    private router: Router,
    private sidenav: SidenavService,
    private route: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.select(selectUserName).subscribe((username) => {
      this.userName = username;
    });
  }

  public logout() {
    this.router.navigate(['/login']);
    sessionStorage.setItem('Token', '');
  }

  public toggleSideBar() {
    this.sidenav.toggleNav();
    let user = JSON.parse(sessionStorage.getItem('User') || '');
    this.userName = user.UserName;
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
