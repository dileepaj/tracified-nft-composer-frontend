import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { Store } from '@ngrx/store';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { AppState } from 'src/app/store/app.state';
import { selectNFTContent } from 'src/app/store/nft-state-store/nft.selector';
import { MatDialog } from '@angular/material/dialog';
import { HtmlCodebehindComponent } from '../../modals/html-codebehind/html-codebehind.component';

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

  @ViewChild('iframe', { static: false }) iframe: ElementRef;

  constructor(
    private _composerService: ComposerBackendService,
    private store: Store<AppState>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getNftContent();
  }

  public ngAfterViewInit() {
    this.loaded = true;
    this.populateIframe(this.iframe.nativeElement);
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

  openCodebehindPopup(){
    this.dialog.open(HtmlCodebehindComponent,{
      data: {htmlCode: this.htmlStr}
    });
  }
}
