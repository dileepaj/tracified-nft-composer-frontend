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
import { WidgetContentComponent } from '../../modals/widget-content/widget-content.component';
import { Widget } from '../../views/composer/composer.component';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { barchart } from 'src/models/nft-content/widgetTypes';

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
  @Input() widget: Widget;

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private service: DndServiceService
  ) {
    this.barchart$ = this.store.select(selectBarCharts);
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    //check if the widget is already in redux store
    if (!this.service.widgetExists(this.id)) {
      this.addBarChartToStore();
    } else {
      this.getBarChart();
    }
  }

  //open configuration popup
  openDialog() {
    this.getBarChart();
    const dialogRef = this.dialog.open(ConfigureBarChartComponent, {
      data: {
        id: this.id,
        widget: this.barChart,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }

  ngOnChanges(val: any) {}

  //delete chart from redux
  deleteWidget() {
    this.store.dispatch(deleteBarChart({ chart: this.barChart }));
    this.onDeleteWidget.emit(this.id);
  }

  //add chart to redux
  private addBarChartToStore() {
    this.barChart = {
      WidgetId: this.id,
      WidgetType: barchart,
      ProjectId: 'ABC',
      ProjectName: 'project1',
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
    this.service.updateUsedStatus(this.id);
  }

  //get chart from redux
  private getBarChart() {
    this.store.select(selectBarCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.id) {
          this.barChart = chart;
        }
      });
    });
  }

  //open batch selection popup
  openAddData() {
    this.getBarChart();
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        widget: this.barChart,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }
}
