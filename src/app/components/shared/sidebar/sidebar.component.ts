import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { AppState } from 'src/app/store/app.state';
import { Observable } from 'rxjs';
import { Image } from 'src/models/nft-content/image';
import {
  selectBarCharts,
  selectNFTContent,
  selectNFTImages,
  selectNoOfBarCharts,
  selectNoOfBubbleCharts,
  selectNoOfCarbonFP,
  selectNoOfImages,
  selectNoOfPieCharts,
  selectNoOfProofbots,
  selectNoOfTables,
  selectNoOfTimelines,
} from 'src/app/store/nft-state-store/nft.selector';
import { Store } from '@ngrx/store';
import { NFTContent } from 'src/models/nft-content/nft.content';

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
  timelineCount: Observable<number>;
  proofBotCount: Observable<number>;
  carbonFPCount: Observable<number>;
  barChartCount: Observable<number>;
  pieChartCount: Observable<number>;
  bubbleChartCount: Observable<number>;
  tableCount: Observable<number>;
  image$: Observable<Image[]>;
  timeline = false;
  nft$: Observable<NFTContent>;

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
    this.timelineCount = this.store.select(selectNoOfTimelines);
    this.proofBotCount = this.store.select(selectNoOfProofbots);
    this.carbonFPCount = this.store.select(selectNoOfCarbonFP);
    this.barChartCount = this.store.select(selectNoOfBarCharts);
    this.pieChartCount = this.store.select(selectNoOfPieCharts);
    this.bubbleChartCount = this.store.select(selectNoOfBubbleCharts);
    this.tableCount = this.store.select(selectNoOfTables);
    this.store.select(selectNFTContent).subscribe((nft) => {
      this.title = nft.ProjectName;
    });
  }

  ngOnInit(): void {}

  toggleLayouts() {
    this.layouts = !this.layouts;
  }

  imagesAvailable() {
    let c = 0;
    let bool = false;
    this.imageCount.subscribe((count) => {
      c = count;
    });

    if (c > 0) {
      bool = true;
    }

    return bool;
  }

  timelineAvailable() {
    let c = 0;
    let bool = false;
    this.timelineCount.subscribe((count) => {
      c = count;
    });

    if (c > 0) {
      bool = true;
    }

    return bool;
  }

  proofbotAvailable() {
    let c = 0;
    let bool = false;
    this.proofBotCount.subscribe((count) => {
      c = count;
    });

    if (c > 0) {
      bool = true;
    }

    return bool;
  }

  carbonAvailable() {
    let c = 0;
    let bool = false;
    this.carbonFPCount.subscribe((count) => {
      c = count;
    });

    if (c > 0) {
      bool = true;
    }

    return bool;
  }

  barChartAvailable() {
    let c = 0;
    let bool = false;
    this.barChartCount.subscribe((count) => {
      c = count;
      console.log(c);
    });

    if (c > 0) {
      bool = true;
    }

    return bool;
  }

  pieChartAvailable() {
    let c = 0;
    let bool = false;
    this.pieChartCount.subscribe((count) => {
      c = count;
    });

    if (c > 0) {
      bool = true;
    }

    return bool;
  }

  bubbleChartAvailable() {
    let c = 0;
    let bool = false;
    this.bubbleChartCount.subscribe((count) => {
      c = count;
    });

    if (c > 0) {
      bool = true;
    }

    return bool;
  }

  tableAvailable() {
    let c = 0;
    let bool = false;
    this.tableCount.subscribe((count) => {
      c = count;
    });

    if (c > 0) {
      bool = true;
    }

    return bool;
  }
}
