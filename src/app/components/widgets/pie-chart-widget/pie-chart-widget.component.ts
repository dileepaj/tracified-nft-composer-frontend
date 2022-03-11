import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { addPieChart } from 'src/app/store/nft-state-store/nft.actions';
import { selectPieCharts } from 'src/app/store/nft-state-store/nft.selector';
import { Chart } from 'src/models/nft-content/chart';
import { ConfigurePieChartComponent } from '../../modals/configure-pie-chart/configure-pie-chart.component';

@Component({
  selector: 'app-pie-chart-widget',
  templateUrl: './pie-chart-widget.component.html',
  styleUrls: ['./pie-chart-widget.component.scss'],
})
export class PieChartWidgetComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  pieChart: Chart;

  constructor(private store: Store<AppState>, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.addPieChartToStore();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfigurePieChartComponent, {
      data: {
        id: this.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteWidget() {
    this.onDeleteWidget.emit(this.id);
  }

  private addPieChartToStore() {
    this.pieChart = {
      ChartId: this.id,
      ChartTitle: 'Pie Chart',
      KeyTitle: 'name',
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
    };
    this.store.dispatch(addPieChart({ chart: this.pieChart }));
    this.getPieChart();
  }

  private getPieChart() {
    this.store.select(selectPieCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.ChartId === this.id) {
          this.pieChart = chart;
        }
      });
    });
  }
}
