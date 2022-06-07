import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { JwtserviceService } from 'src/app/services/jwtservice.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { AppState } from 'src/app/store/app.state';
import {
  selectNFTContent,
  selectProjectSavedState,
} from 'src/app/store/nft-state-store/nft.selector';
import {
  selectUserDetail,
  selectUserName,
} from 'src/app/store/user-state-store/user.selector';
import { ComposerUser } from 'src/models/user';
import { CloseProjectComponent } from '../../modals/close-project/close-project.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public routerProjectLink: string;
  user: ComposerUser;
  projectSaved: boolean;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private sidenav: SidenavService,
    private userServices: UserserviceService,
    private jwtServices: JwtserviceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user = this.userServices.getCurrentUser();
    this.setLink();
    this.store.select(selectProjectSavedState).subscribe((status) => {
      this.projectSaved = status;
    });
  }

  /**
   * @function logout - when click on logout go back to login page and release the token
   */
  public logout() {
    let tenentId = JSON.parse(sessionStorage.getItem('User') || '').TenentId!;

    if (this.router.url !== `/layout/projects/${tenentId}`) {
      if (!this.projectSaved) {
        this.dialog.open(CloseProjectComponent, {
          data: {
            user: this.user,
            logout: true,
          },
        });
      } else {
        this.router.navigate(['/login']);
        sessionStorage.setItem('Token', '');
      }
    } else {
      this.router.navigate(['/login']);
      sessionStorage.setItem('Token', '');
    }
  }

  /**
   * @function toggleSideBar - open the side menu
   */
  public toggleSideBar() {
    this.sidenav.toggleNav();
    this.user = this.userServices.getCurrentUser();
  }

  /**
   * @function isProjectsView - check if the current view is project view
   */
  public isProjectsView() {
    let tenentId = JSON.parse(sessionStorage.getItem('User') || '').TenentId!;
    if (this.router.url === `/layout/projects/${tenentId}`) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @function setLink - set the project view link
   */
  public setLink() {
    let tenentId = JSON.parse(sessionStorage.getItem('User') || '').TenentId!;
    this.routerProjectLink = `/layout/projects/${tenentId}`;
  }

  public goToProjects() {
    let tenentId = JSON.parse(sessionStorage.getItem('User') || '').TenentId!;

    if (this.router.url !== `/layout/projects/${tenentId}`) {
      if (!this.projectSaved) {
        this.dialog.open(CloseProjectComponent, {
          data: {
            user: this.user,
          },
        });
      } else {
        this.router.navigate(['/layout/projects/' + this.user.TenentId]);
      }
    } else {
      this.router.navigate(['/layout/projects/' + this.user.TenentId]);
    }
  }
}
