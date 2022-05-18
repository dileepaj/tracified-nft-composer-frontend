import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/store/app.state';
import { Observable } from 'rxjs';
import { Image } from 'src/models/nft-content/image';
import {
  selectBarCharts,
  selectBubbleCharts,
  selectCarbonFP,
  selectNFTContent,
  selectNFTImages,
  selectPieCharts,
  selectProofBot,
  selectTable,
  selectTimeline,
  selectWidgetOrder,
} from 'src/app/store/nft-state-store/nft.selector';
import { Store } from '@ngrx/store';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { UserserviceService } from 'src/app/services/userservice.service';
import { ComposerUser } from 'src/models/user';
import { Chart } from 'src/models/nft-content/chart';
import { Table } from 'src/models/nft-content/table';
import { Timeline } from 'src/models/nft-content/timeline';
import { ProofBot } from 'src/models/nft-content/proofbot';
import { CarbonFootprint } from 'src/models/nft-content/carbonFootprint';
import {
  barchart,
  bubblechart,
  carbonFp,
  nftimage,
  piechart,
  proofbot,
  table,
  timeline,
} from 'src/models/nft-content/widgetTypes';
import { WidgethighlightingService } from 'src/app/services/widgethighlighting.service';
import { MatDialog } from '@angular/material/dialog';
import { CloseProjectComponent } from '../../modals/close-project/close-project.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  title = 'project_name';
  layouts = true;
  green = '#ccc';

  image$: Observable<Image[]>;
  timeline = false;

  barCharts: Chart[] = [];
  pieCharts: Chart[] = [];
  bubbleCharts: Chart[] = [];
  tables: Table[] = [];
  images: Image[] = [];
  timelines: Timeline[] = [];
  proofbots: ProofBot[] = [];
  carbonfps: CarbonFootprint[] = [];
  contOrder: any[] = [];

  barChartType = barchart;
  pieChartType = piechart;
  bubbleChartType = bubblechart;
  tableType = table;
  imageType = nftimage;
  timelineType = timeline;
  proofbotType = proofbot;
  carbonfpType = carbonFp;

  nft$: Observable<NFTContent>;
  projId: string = '';
  layoutLink: string = '/layout/home/';
  user: ComposerUser;
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

  constructor(
    private store: Store<AppState>,
    private userService: UserserviceService,
    private highlightService: WidgethighlightingService,
    public dialog: MatDialog
  ) {
    //get project details
    const subscription = this.store
      .select(selectNFTContent)
      .subscribe((nft) => {
        this.title = nft.ProjectName;
        this.projId = nft.ProjectId;
        this.layoutLink += this.projId;
      });

    //unsubscribe from redux state
    subscription.unsubscribe();
  }

  ngOnInit(): void {
    //get logged user's details
    this.user = this.userService.getCurrentUser();

    //read widget arrays in redux store
    this.store.select(selectBarCharts).subscribe((data) => {
      this.barCharts = data;
    });
    this.store.select(selectPieCharts).subscribe((data) => {
      this.pieCharts = data;
    });
    this.store.select(selectBubbleCharts).subscribe((data) => {
      this.bubbleCharts = data;
    });
    this.store.select(selectTable).subscribe((data) => {
      this.tables = data;
    });
    this.store.select(selectTimeline).subscribe((data) => {
      this.timelines = data;
    });
    this.store.select(selectProofBot).subscribe((data) => {
      this.proofbots = data;
    });
    this.store.select(selectNFTImages).subscribe((data) => {
      this.images = data;
    });
    this.store.select(selectCarbonFP).subscribe((data) => {
      this.carbonfps = data;
    });

    this.store.select(selectWidgetOrder).subscribe((data) => {
      this.contOrder = data;
    });
  }

  //used to collapse/ expand layout panel
  public toggleLayouts() {
    this.layouts = !this.layouts;
  }

  //get the titles of each widget
  public getTitle(widget: any): string {
    let title: string = '';

    //checks the type of the widget
    switch (widget.Type) {
      case this.barChartType:
        //loop through bar charts array and find the title
        for (let i = 0; i < this.barCharts.length; i++) {
          if (this.barCharts[i].WidgetId === widget.WidgetId) {
            title = this.barCharts[i].ChartTitle!;
            break;
          }
        }
        break;
      case this.pieChartType:
        //loop through pie charts array and find the title
        for (let i = 0; i < this.pieCharts.length; i++) {
          if (this.pieCharts[i].WidgetId === widget.WidgetId) {
            title = this.pieCharts[i].ChartTitle!;
            break;
          }
        }
        break;
      case this.bubbleChartType:
        //loop through bubble charts array and find the title
        for (let i = 0; i < this.bubbleCharts.length; i++) {
          if (this.bubbleCharts[i].WidgetId === widget.WidgetId) {
            title = this.bubbleCharts[i].ChartTitle!;
            break;
          }
        }
        break;
      case this.proofbotType:
        //loop through proofbots array and find the title
        for (let i = 0; i < this.proofbots.length; i++) {
          if (this.proofbots[i].WidgetId === widget.WidgetId) {
            title = this.proofbots[i].Title!;
            break;
          }
        }
        break;
      case this.timelineType:
        //loop through timelines array and find the title
        for (let i = 0; i < this.timelines.length; i++) {
          if (this.timelines[i].WidgetId === widget.WidgetId) {
            title = this.timelines[i].Title!;
            break;
          }
        }
        break;
      case this.carbonfpType:
        //loop through carbon footprint array and find the title
        for (let i = 0; i < this.carbonfps.length; i++) {
          if (this.carbonfps[i].WidgetId === widget.WidgetId) {
            title = 'carbon_fp';
            break;
          }
        }
        break;
      case this.tableType:
        //loop through tables array and find the title
        for (let i = 0; i < this.tables.length; i++) {
          if (this.tables[i].WidgetId === widget.WidgetId) {
            title = this.tables[i].TableTitle!;
            break;
          }
        }
        break;
      case this.imageType:
        //loop through images array and find the title
        for (let i = 0; i < this.images.length; i++) {
          if (this.images[i].WidgetId === widget.WidgetId) {
            title = this.images[i].Title!;
            break;
          }
        }
        break;
    }

    return title;
  }

  //called when user clicks on a widget
  public selectWidget(id: string) {
    this.highlightService.selectWidget(id);
  }

  public closeProject() {
    this.dialog.open(CloseProjectComponent, {
      data: {
        user: this.user,
      },
    });
  }
}
