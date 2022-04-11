import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/store/app.state';
import { Observable } from 'rxjs';
import { Image } from 'src/models/nft-content/image';
import {
  selectNFTContent,
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
  imageCount: number;
  timelineCount: number;
  proofBotCount: number;
  carbonFPCount: number;
  barChartCount: number;
  pieChartCount: number;
  bubbleChartCount: number;
  tableCount: number;
  image$: Observable<Image[]>;
  timeline = false;
  nft$: Observable<NFTContent>;
  projId: string = '';
  layoutLink: string = '/layout/home/';

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
    this.store.select(selectNFTContent).subscribe((nft) => {
      this.title = nft.ProjectName;
      this.projId = nft.ProjectId;
      this.layoutLink += this.projId;
    });
  }

  ngOnInit(): void {
    this.store.select(selectNoOfBarCharts).subscribe((c) => {
      this.barChartCount = c;
    });
    this.store.select(selectNoOfPieCharts).subscribe((c) => {
      this.pieChartCount = c;
    });
    this.store.select(selectNoOfBubbleCharts).subscribe((c) => {
      this.bubbleChartCount = c;
    });
    this.store.select(selectNoOfTables).subscribe((c) => {
      this.tableCount = c;
    });
    this.store.select(selectNoOfTimelines).subscribe((c) => {
      this.timelineCount = c;
    });
    this.store.select(selectNoOfProofbots).subscribe((c) => {
      this.proofBotCount = c;
    });
    this.store.select(selectNoOfImages).subscribe((c) => {
      this.imageCount = c;
    });
    this.store.select(selectNoOfCarbonFP).subscribe((c) => {
      this.carbonFPCount = c;
    });
  }

  public toggleLayouts() {
    this.layouts = !this.layouts;
  }
}
