import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-nft-svg',
  templateUrl: './nft-svg.component.html',
  styleUrls: ['./nft-svg.component.scss'],
})
export class NftSvgComponent implements OnInit {
  sidenav: boolean = true;
  constructor(private sidebarService: SidenavService) {
    this.sidebarService.getStatus().subscribe((val) => {
      this.sidenav = val;
    });
  }

  ngOnInit(): void {}
}
