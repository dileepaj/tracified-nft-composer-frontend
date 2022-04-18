import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userName: string = 'aaaaaaaa@Gmail.com';
  constructor(private router: Router, private sidenav: SidenavService) {}

  ngOnInit(): void {

    if (!!sessionStorage.getItem('User')) {
      let user = JSON.parse(sessionStorage.getItem('User') || '');
      this.userName = user.UserName;
    }
  }

  public logout() {
    this.router.navigate(['/login']);
    sessionStorage.setItem('Token', '');
  }

  public toggleSideBar() {
    this.sidenav.toggleNav();
  }
}
