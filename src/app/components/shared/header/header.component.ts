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
  user: any;
  projectSaved: boolean;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private sidenav: SidenavService,
    private userServices: UserserviceService,
    private jwt: JwtserviceService,
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
    if (
      !!this.jwt.getUser().UserID &&
      this.router.url !==
        `/layout/projects/${this.jwt.getUser().UserID}` &&
      !this.projectSaved
    ) {
      this.dialog.open(CloseProjectComponent, {
        data: {
          user: this.user,
          logout: true,
        },
      });
    } else {
      this.jwt.destroyToken();
      this.router.navigate(['/login']);
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
    if (
      !!this.jwt.getUser().UserID &&
      this.router.url ===
        `/layout/projects/${this.jwt.getUser().UserID}`
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @function setLink - set the project view link
   */
  public setLink() {
    if (!!this.jwt.getUser()) {
      let tenentId = this.jwt.getUser().UserID;
      this.routerProjectLink = `/layout/projects/${tenentId}`;
    } else {
      this.router.navigate(['/login']);
    }
  }

  public goToProjects() {
    if (
      !!this.jwt.getUser().UserID &&
      this.router.url !==
        `/layout/projects/${this.jwt.getUser().UserID}` &&
      !this.projectSaved
    ) {
      this.dialog.open(CloseProjectComponent, {
        data: {
          user: this.user,
        },
      });
    } else {
      this.router.navigate(['/layout/projects/' + this.user.UserID]);
    }
  }
}
