import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  addBubbleChart,
  deleteBarChart,
  deleteBubbleChart,
} from 'src/app/store/nft-state-store/nft.actions';
import { selectBubbleCharts } from 'src/app/store/nft-state-store/nft.selector';
import { Chart } from 'src/models/nft-content/chart';
import { ConfigureBubbleChartComponent } from '../../modals/configure-bubble-chart/configure-bubble-chart.component';

@Component({
  selector: 'app-bubble-chart-widget',
  templateUrl: './bubble-chart-widget.component.html',
  styleUrls: ['./bubble-chart-widget.component.scss'],
})
export class BubbleChartWidgetComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  bubbleChart: Chart;
  constructor(private store: Store<AppState>, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.addBubbleChartToStore();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfigureBubbleChartComponent, {
      data: {
        id: this.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteWidget() {
    this.store.dispatch(deleteBubbleChart({ chart: this.bubbleChart }));
    this.onDeleteWidget.emit(this.id);
  }

  private addBubbleChartToStore() {
    this.bubbleChart = {
      WidgetId: this.id,
      ChartTitle: 'Bubble Chart',
      KeyTitle: 'name',
      ValueTitle: 'val',
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
  }

  private getBubbleChart() {
    this.store.select(selectBubbleCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.id) {
          this.bubbleChart = chart;
        }
      });
    });
  }
}
