import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppState } from 'src/app/store/app.state';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { Store } from '@ngrx/store';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { selectNFTContent } from 'src/app/store/nft-state-store/nft.selector';
import domtoimage from 'dom-to-image';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-nft-svg',
  templateUrl: './nft-svg.component.html',
  styleUrls: ['./nft-svg.component.scss'],
})
export class NftSvgComponent implements OnInit {
  sidenav: boolean = true;
  svgSrc: any;
  nft$: NFTContent;
  nftContent: NFTContent;
  imageInfo: any[];
  svg:SafeHtml;
  htmlStr: any;

  @ViewChild('iframe', { static: false }) iframe: ElementRef;

  constructor(
    private _composerService: ComposerBackendService,
    private store: Store<AppState>,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getNftContent();
    this.genereateImage();
  }

  public ngAfterViewInit() {
    this.populateIframe(this.iframe.nativeElement);
  }

  private getNftContent() {
    this.store.select(selectNFTContent).subscribe((data) => {
      this.nftContent = data;
    });
  }

  public genereateImage() {
    this.convertToSvg().then((data) => {
      this.svgSrc = data;
      //this.svg = this.sanitizer.bypassSecurityTrustHtml(this.svgSrc);
      console.log(this.svgSrc);
    });
  }

  public convertToSvg() {
    function filter(node: any) {
      return node.tagName !== 'i';
    }

    var promise = new Promise((resolve, reject) => {
      var node: any = document.getElementById('image-section');
      domtoimage
        .toSvg(node, { filter: filter })
        .then(function (dataUrl) {
          var img = new Image();
          img.src = dataUrl;
          resolve(img.src);
        })
        .catch(function (error) {
          console.error('Issue', error);
        });
    });
    return promise;
  }

  private populateIframe(iframe: any) {
    //get from backend
    this._composerService
      .generateHTML(this.nftContent)
      .subscribe((data:any)=> {
        if(!!data && !!data.Response && data.Response !== ''){
          this.htmlStr = atob(data.Response);
          const content = this.htmlStr;
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(content);
          iframe.contentWindow.document.close();
        }
      });
  }
}
