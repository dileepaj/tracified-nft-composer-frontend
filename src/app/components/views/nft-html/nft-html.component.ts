import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { selectNFTContent } from 'src/app/store/nft-state-store/nft.selector';
import { NFTContent } from 'src/models/nft-content/nft.content';

@Component({
  selector: 'app-nft-html',
  templateUrl: './nft-html.component.html',
  styleUrls: ['./nft-html.component.scss'],
})
export class NftHtmlComponent implements OnInit {
  nft$: Observable<NFTContent>;
  json: any;

  constructor(private store: Store<AppState>) {
    this.nft$ = this.store.select(selectNFTContent);
  }
;
  ngOnInit(): void {';'
    this.json = JSON.stringify(this.nft$, this.getCircularReplacer())
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
