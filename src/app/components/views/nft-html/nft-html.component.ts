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
  url = '../../../../../nft.html';
  constructor() {}
  ngOnInit(): void {}
}
