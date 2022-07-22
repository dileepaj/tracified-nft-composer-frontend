import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { Store } from '@ngrx/store';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { AppState } from 'src/app/store/app.state';
import {
  selectNFTContent,
  selectProjectSavedState,
  selectProjectStatus,
} from 'src/app/store/nft-state-store/nft.selector';
import { MatDialog } from '@angular/material/dialog';
import { HtmlCodebehindComponent } from '../../modals/html-codebehind/html-codebehind.component';
import { Router } from '@angular/router';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';
import { ComposerUser } from 'src/models/user';

@Component({
  selector: 'app-nft-html',
  templateUrl: './nft-html.component.html',
  styleUrls: ['./nft-html.component.scss'],
})
export class NftHtmlComponent implements OnInit {
  nft$: NFTContent;
  json: any;
  sidenav: boolean = true;
  htmlStr: any;
  nftContent: NFTContent;
  loaded: boolean = false;
  user: ComposerUser;
  projectSaved: boolean;
  projLoading: boolean = false;
  newProj: boolean;
  codeLoaded: boolean = false;

  @ViewChild('iframe', { static: false }) iframe: ElementRef;

  constructor(
    private _composerService: ComposerBackendService,
    private store: Store<AppState>,
    public dialog: MatDialog,
    private router: Router,
    private projectLoader: ProjectLoaderService
  ) {}

  ngOnInit(): void {
    this.getNftContent();
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
    this.loaded = true;
    if (parseInt(sessionStorage.getItem('composerRefreshed') || '0') === 1) {
      this.pageRefreshed();
    } else {
      this.populateIframe(this.iframe.nativeElement);
    }
  }

  private getNftContent() {
    this.store.select(selectNFTContent).subscribe((data) => {
      this.nftContent = data;
    });
  }
  private populateIframe(iframe: any) {
    //get from backend
    this._composerService
      .generateHTML(this.nftContent)
      .subscribe((data: any) => {
        if (!!data && !!data.Response && data.Response !== '') {
          this.htmlStr = atob(data.Response);
          const content = this.htmlStr;
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(content);
          iframe.contentWindow.document.close();
          this.loaded = false;
        }
      });
  }

  openCodebehindPopup() {
    this.codeLoaded = true;
    setTimeout(()=>{                           
      this.dialog.open(HtmlCodebehindComponent, {
        data: { htmlCode: this.htmlStr },
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
