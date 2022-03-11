import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { AppState } from 'src/app/store/app.state';
import { Observable } from 'rxjs';
import { Image } from 'src/models/nft-content/image';
import {
  selectNFTImages,
  selectNoOfImages,
} from 'src/app/store/nft-state-store/nft.selector';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  title = 'project_name';
  layouts = true;
  green = '#ccc';
  imageCount: Observable<number>;
  image$: Observable<Image[]>;

  widgets = [
    {
      _id: 1,
      name: 'Timeline',
      icon: 'event_note',
    },
    {
      _id: 2,
      name: 'ProofBot',
      icon: 'ondemand_video',
    },
    {
      _id: 3,
      name: 'Carbon Footprint',
      icon: 'filter_drama',
    },
    {
      _id: 4,
      name: 'NFT Image',
      icon: 'wallpaper',
    },
    {
      wid: 5,
      name: 'Bar Chart',
      icon: 'bar_chart',
    },
    {
      wid: 6,
      name: 'Pie Chart',
      icon: 'pie_chart',
    },
    {
      wid: 7,
      name: 'Bubble Chart',
      icon: 'bubble_chart',
    },
  ];

  constructor(private store: Store<AppState>) {
    this.imageCount = this.store.select(selectNoOfImages);
  }

  ngOnInit(): void {}

  toggleLayouts() {
    this.layouts = !this.layouts;
  }
}
