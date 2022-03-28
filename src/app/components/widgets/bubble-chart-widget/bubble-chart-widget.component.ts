import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  addBubbleChart,
  deleteBarChart,
  deleteBubbleChart,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectBubbleCharts,
  selectNFTContent,
} from 'src/app/store/nft-state-store/nft.selector';
import { Chart } from 'src/models/nft-content/chart';
import { bubblechart } from 'src/models/nft-content/widgetTypes';
import { ConfigureBubbleChartComponent } from '../../modals/configure-bubble-chart/configure-bubble-chart.component';
import { WidgetContentComponent } from '../../modals/widget-content/widget-content.component';

@Component({
  selector: 'app-bubble-chart-widget',
  templateUrl: './bubble-chart-widget.component.html',
  styleUrls: ['./bubble-chart-widget.component.scss'],
})
export class BubbleChartWidgetComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  bubbleChart: Chart;
  projectId: string;
  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private service: DndServiceService
  ) {
    this.store.select(selectNFTContent).subscribe((content) => {
      this.projectId = content.ProjectId;
    });
  }

  ngOnInit(): void {
    //check if the widget is already in redux store
    if (!this.service.widgetExists(this.id)) {
      this.addBubbleChartToStore();
    } else {
      this.getBubbleChart();
    }
  }

  //open configuration popup
  openDialog() {
    this.getBubbleChart();
    const dialogRef = this.dialog.open(ConfigureBubbleChartComponent, {
      data: {
        id: this.id,
        widget: this.bubbleChart,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }

  //delete chart from redux
  deleteWidget() {
    this.store.dispatch(deleteBubbleChart({ chart: this.bubbleChart }));
    this.onDeleteWidget.emit(this.id);
  }

  //add chart to redux
  private addBubbleChartToStore() {
    this.bubbleChart = {
      WidgetId: this.id,
      WidgetType: bubblechart,
      ProjectId: this.projectId,
      ProjectName: 'project1',
      ChartTitle: 'Bubble Chart',
      KeyTitle: 'Name',
      ValueTitle: 'Value',
      ChartData: [],
      Color: [
        '#c7d3ec',
        '#a5b8db',
        '#879cc4',
        '#677795',
        '#5a6782',
        '#c7d3ec',
        '#a5b8db',
        '#879cc4',
        '#677795',
        '#5a6782',
      ],
      FontColor: '#000000',
      FontSize: 12,
      Height: 295,
      Width: 295,
    };
    this.store.dispatch(addBubbleChart({ chart: this.bubbleChart }));
    this.getBubbleChart();
    this.service.updateUsedStatus(this.id);
  }

  //get chart from redux
  private getBubbleChart() {
    this.store.select(selectBubbleCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.id) {
          this.bubbleChart = chart;
        }
      });
    });
  }

  //open batch selection popup
  openAddData() {
    this.getBubbleChart();
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        widget: this.bubbleChart,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
