import {
  Component,
  OnInit,
  Inject,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { ConfigureBarChartComponent } from '../../modals/configure-bar-chart/configure-bar-chart.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chart } from 'src/models/nft-content/chart';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  selectBarCharts,
  selectNFTContent,
} from 'src/app/store/nft-state-store/nft.selector';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import {
  addBarChart,
  deleteBarChart,
} from 'src/app/store/nft-state-store/nft.actions';

@Component({
  selector: 'app-bar-chart-widget',
  templateUrl: './bar-chart-widget.component.html',
  styleUrls: ['./bar-chart-widget.component.scss'],
})
export class BarChartWidgetComponent implements OnInit, AfterViewInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  barchart$: Observable<Chart[]>;
  barChart: Chart;

  constructor(private store: Store<AppState>, public dialog: MatDialog) {
    this.barchart$ = this.store.select(selectBarCharts);
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.addBarChartToStore();
    console.log('id - ', this.id);
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfigureBarChartComponent, {
      data: {
        id: this.id,
      },
    });

    console.log('dbl click widget - ' + this.id);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      console.log(this.barchart$);
    });
  }

  ngOnChanges(val: any) {
    console.log('bar chart widget - updated!');
  }

  deleteWidget() {
    this.store.dispatch(deleteBarChart({ chart: this.barChart }));
    this.onDeleteWidget.emit(this.id);
  }

  private addBarChartToStore() {
    this.barChart = {
      WidgetId: this.id,
      ChartTitle: 'Bar Chart',
      KeyTitle: 'name',
      ValueTitle: 'value',
      ChartData: [],
      Color: [
        '#69b3a2',
        '#69b3a2',
        '#69b3a2',
        '#69b3a2',
        '#69b3a2',
        '#69b3a2',
        '#69b3a2',
        '#69b3a2',
        '#69b3a2',
        '#69b3a2',
      ],
      FontColor: '#000000',
      FontSize: 10,
      XAxis: 'X Axis',
      YAxis: 'Y Axis',
      Width: 450,
      Height: 100,
    };
    this.store.dispatch(addBarChart({ chart: this.barChart }));
    this.getBarChart();
  }

  private getBarChart() {
    this.store.select(selectBarCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.id) {
          this.barChart = chart;
        }
      });
    });
  }
}
