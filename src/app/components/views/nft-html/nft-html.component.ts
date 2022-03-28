import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SidenavService } from 'src/app/services/sidenav.service';
import { AppState } from 'src/app/store/app.state';
import { selectNFTContent } from 'src/app/store/nft-state-store/nft.selector';
import { NFTContent } from 'src/models/nft-content/nft.content';

@Component({
  selector: 'app-nft-html',
  templateUrl: './nft-html.component.html',
  styleUrls: ['./nft-html.component.scss'],
})
export class NftHtmlComponent implements OnInit {
  nft$: NFTContent;
  json: any;
  sidenav: boolean = true;

  constructor(
    private store: Store<AppState>,
    private sidebarService: SidenavService
  ) {
    this.store.select(selectNFTContent).subscribe((data) => {
      this.nft$ = data;
    });
    this.sidebarService.getStatus().subscribe((val) => {
      this.sidenav = val;
    });
  }
  ngOnInit(): void {
    ';';
    this.json = JSON.stringify(this.nft$, this.getCircularReplacer());
  }

  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key: any, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };
}
