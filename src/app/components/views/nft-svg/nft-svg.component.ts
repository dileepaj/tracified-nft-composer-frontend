import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { AppState } from 'src/app/store/app.state';
import { selectNFTContent } from 'src/app/store/nft-state-store/nft.selector';
import { NFTContent } from 'src/models/nft-content/nft.content';
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

  @ViewChild('iframe', { static: false }) iframe: ElementRef;

  constructor(
    private sidebarService: SidenavService,
    private store: Store<AppState>,
    private _composerService: ComposerBackendService,
    public dialog: MatDialog
  ) {
    this.sidebarService.getStatus().subscribe((val) => {
      this.sidenav = val;
    });
  }

  ngOnInit(): void {
    this.store.select(selectNFTContent).subscribe((content) => {
      this.nftContent = content;
    });
  }

  public ngAfterViewInit() {
    this.loading = false;
    this.populateIframe(this.iframe.nativeElement);
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
    this.dialog.open(SvgCodebehindComponent, {
      data: { svgCode: this.svgStr },
    });
  }
}
