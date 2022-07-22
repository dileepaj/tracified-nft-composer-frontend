import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { AppState } from 'src/app/store/app.state';
import {
  selectNFTContent,
  selectProjectSavedState,
  selectProjectStatus,
} from 'src/app/store/nft-state-store/nft.selector';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { ComposerUser } from 'src/models/user';
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

  @ViewChild('iframe', { static: false }) iframe: ElementRef;

  constructor(
    private sidebarService: SidenavService,
    private store: Store<AppState>,
    private _composerService: ComposerBackendService,
    public dialog: MatDialog,
    private router: Router,
    private projectLoader: ProjectLoaderService
  ) {
    this.sidebarService.getStatus().subscribe((val) => {
      this.sidenav = val;
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
          this.svgStr = atob(data.Response);
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
    setTimeout(()=>{                           
      this.dialog.open(SvgCodebehindComponent, {
        data: { svgCode: this.svgStr },
      });
      this.codeLoaded = false;
    },100);
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
}
