import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private sidenav: SidenavService) {}

  ngOnInit(): void {}

  logout() {
    this.router.navigate(['/login']);
    sessionStorage.setItem('authorized', 'NOT');
  }

  toggleSideBar() {
    this.sidenav.toggleNav();
  }
}
