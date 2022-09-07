import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { AppState } from 'src/app/store/app.state';
import {
  selectNFTContent,
  selectProjectSavedState,
  selectProjectStatus,
} from 'src/app/store/nft-state-store/nft.selector';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { ComposerUser } from 'src/models/user';
import { CloseProjectComponent } from '../../modals/close-project/close-project.component';
import { SvgCodebehindComponent } from '../../modals/svg-codebehind/svg-codebehind.component';

@Component({
  selector: 'app-nft-svg',
  templateUrl: './nft-svg.component.html',
  styleUrls: ['./nft-svg.component.scss'],
})
export class NftSvgComponent implements OnInit {
  sidenav: boolean = true;
  nftContent: NFTContent;
  svgStr: string;
  loading: boolean = true;
  user: ComposerUser;
  projectSaved: boolean;
  projLoading: boolean = false;
  newProj: boolean;
  codeLoaded: boolean = false;
  sideNavMode: MatDrawerMode = 'side';
  isClicked: boolean = false;
  opened = true;
  title = 'project_name';
  projId: string = '';

  @ViewChild('iframe', { static: false }) iframe: ElementRef;

  constructor(
    private sidebarService: SidenavService,
    private store: Store<AppState>,
    private _composerService: ComposerBackendService,
    public dialog: MatDialog,
    private router: Router,
    private projectLoader: ProjectLoaderService,
    private userService: UserserviceService
  ) {
    this.sidebarService.getStatus().subscribe((val) => {
      this.sidenav = val;
    });
    const subscription = this.store
      .select(selectNFTContent)
      .subscribe((nft) => {
        this.title = nft.ProjectName;
        this.projId = nft.ProjectId;
      });
  }

  ngOnInit(): void {
    this.store.select(selectNFTContent).subscribe((content) => {
      this.nftContent = content;
    });
    this.store.select(selectProjectSavedState).subscribe((status) => {
      this.projectSaved = status;
    });
    this.store.select(selectProjectStatus).subscribe((status) => {
      this.newProj = status;
    });
    this.user = this.userService.getCurrentUser();
    if (window.innerWidth < 960) {
      this.sidebarService.close();
      this.sideNavMode = 'over';
      this.opened = false;
      this.isClicked = true;
    } else {
      this.sidebarService.open();
      this.sideNavMode = 'side';
      this.opened = true;
      this.isClicked = false;
    }
  }

  ngOnDestroy() {
    sessionStorage.setItem('composerRefreshed', '0');
  }

  public ngAfterViewInit() {
    this.loading = false;
    if (parseInt(sessionStorage.getItem('composerRefreshed') || '0') === 1) {
      this.pageRefreshed();
    } else {
      this.populateIframe(this.iframe.nativeElement);
    }
  }

  private populateIframe(iframe: any) {
    this.loading = true;
    //get from backend
    this._composerService
      .generateSVG(this.nftContent)
      .subscribe((data: any) => {
        if (!!data && !!data.Response && data.Response !== '') {
          this.svgStr = this.b64DecodeUnicode(data.Response);
          const content = this.svgStr;
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(content);
          iframe.contentWindow.document.close();
          this.loading = false;
        }
      });
  }

  openCodebehindPopup() {
    this.codeLoaded = true;
    setTimeout(() => {
      this.dialog.open(SvgCodebehindComponent, {
        data: { svgCode: this.svgStr },
        autoFocus: false,
      });
      this.codeLoaded = false;
    }, 100);
  }

  //listen to page refresh event
  @HostListener('window:beforeunload', ['$event']) openConfirmation(e: any) {
    e.preventDefault();
    sessionStorage.setItem('composerRefreshed', '1');
    sessionStorage.setItem('composerNewProject', this.newProj ? '1' : '0');
    if (!this.projectSaved) {
      e.returnValue = 'Changes may not be saved.';
    }
    return e;
  }

  private b64DecodeUnicode(str: string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }

  //check whether page was refreshed or not
  private pageRefreshed() {
    const projectId = sessionStorage.getItem('composerProjectId') || '';
    const newProject = sessionStorage.getItem('composerNewProject') || '1';
    if (projectId !== '') {
      this.projLoading = true;
      if (parseInt(newProject) === 1) {
        this.projectLoader.loadNewProject((success: boolean) => {
          if (success) {
            this.populateIframe(this.iframe.nativeElement);
            sessionStorage.setItem('composerRefreshed', '0');
            this.projLoading = false;
          } else {
            this.router.navigate(['/layout/projects/' + this.user.TenentId]);
            sessionStorage.setItem('composerRefreshed', '0');
            this.projLoading = false;
          }
        });
      } else {
        this.projectLoader.loadExistingProject(projectId, () => {
          this.populateIframe(this.iframe.nativeElement);
          sessionStorage.setItem('composerRefreshed', '0');
          this.projLoading = false;
        });
      }
    } else {
      this.router.navigate(['/layout/projects/' + this.user.TenentId]);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 960) {
      this.opened = false;
      this.sideNavMode = 'over';
      this.isClicked = true;
      this.sidebarService.close();
    } else {
      this.opened = true;
      this.sideNavMode = 'side';
      this.isClicked = false;
      this.sidebarService.open();
    }
  }

  public closeProject() {
    //check whether all the changes are already saved or not
    if (!this.projectSaved) {
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
