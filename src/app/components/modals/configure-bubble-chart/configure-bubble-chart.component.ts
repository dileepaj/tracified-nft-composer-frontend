import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  addBubbleChart,
  updateBubbleChart,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectBubbleCharts,
  selectNFTContent,
  selectQueryResult,
} from 'src/app/store/nft-state-store/nft.selector';
import { Chart, Data } from 'src/models/nft-content/chart';
import { bubblechart } from 'src/models/nft-content/widgetTypes';

@Component({
  selector: 'app-configure-bubble-chart',
  templateUrl: './configure-bubble-chart.component.html',
  styleUrls: ['./configure-bubble-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigureBubbleChartComponent implements OnInit {
  nft$: any;
  tabIndex: number = 0;
  bubbleChart: Chart;
  chartId: any;
  keyTitle: any;
  query: string = '';
  batchId: any = '';
  productName: string = '';
  chartData: any;
  bubbleChartOptions: any;
  labels: string[] = [];
  values: any = [];
  //data to be displayed in the pie chart
  bubbleChartData: Data[] = [
    { Name: 'Item 1', X: 100, Y: 60, Value: 1350 },
    { Name: 'Item 2', X: 30, Y: 80, Value: 2500 },
    { Name: 'Item 3', X: 50, Y: 40, Value: 5700 },
    { Name: 'Item 4', X: 190, Y: 100, Value: 30000 },
    { Name: 'Item 5', X: 80, Y: 170, Value: 47500 },
  ];
  bubbleColors: string[] = [];
  domain: number[] = [0, 1000]; //domain of the bar chart
  min: number = 0; //domain minimum value
  max: number = 1000; //domain maximum value
  counter: number = 1; //counter to count total number of values in data array
  title: string = 'Bubble Chart';
  xName: string = 'X axis'; //x axis name
  yName: string = 'Y axis'; //y axis name
  fontSize: number = 10; //font size
  fontColor: string = '#000000'; //font color
  radius: number[] = [];

  private svg: any;
  private margin = 5;
  private width = 300 - this.margin;
  private height = 300 - this.margin;

  saving: boolean = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private composerService: ComposerBackendService,
    private dndService: DndServiceService,
    private _snackBar: MatSnackBar
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    this.chartId = this.data.id;
    this.bubbleChart = this.data.widget;
  }

  //check , executed query save or not  use this function for show the congigure button
  CheckQuerySavingStatus(): boolean {
    let buttonState = false;
    this.store.select(selectQueryResult).subscribe((data) => {
      if (data.some((e) => e.WidgetId === this.data.id)) {
        buttonState = true;
      }
    });
    return buttonState;
  }

  setValueToBubblerChart() {
    this.store.select(selectQueryResult).subscribe((data) => {
      let Chartvalue = data.find((v) => v.WidgetId === this.data.id);
      if (
        !!Chartvalue &&
        Chartvalue != undefined &&
        Chartvalue.queryResult != ''
      ) {
        let Chartobject = JSON.stringify(Chartvalue.queryResult);
        let dta = eval(Chartobject);
        let a = JSON.parse(dta);
        let b: Data[] = [];
        //let val : string;
        a.val.ChartData.map((data: any) => {
          let val = parseFloat(data.Value);
          b.push({ Name: data.Name, Value: val });
        });

        this.bubbleChartData = b;

        this.setLabels();
        this.setValues();
        this.setColors();
      }
    });
  }

  private createSvg(): void {
    this.svg = d3
      .select('#bubble')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  //called when user moves to a different tab
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1) {
      this.assignValues();
      this.setValueToBubblerChart();
      this.drawChart();
    }
  }

  private showChart() {}

  //update redux store
  updateReduxState() {
    this.saving = true;
    this.bubbleChart = {
      ...this.bubbleChart,
      ChartTitle: this.title,
      Query: this.query,
      ChartData: this.bubbleChartData,
      Color: this.bubbleColors,
      Radius: this.radius,
      FontColor: this.fontColor,
      FontSize: this.fontSize,
      Height: 300,
      Width: 500,
    };

    this.saveChart(this.bubbleChart);
    this.bubbleChart = {
      ...this.bubbleChart,
      Height: this.height,
      Width: this.width,
    };
    this.store.dispatch(updateBubbleChart({ chart: this.bubbleChart }));
  }

  //get chart from redux store
  private getBubbleChart() {
    this.store.select(selectBubbleCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.chartId) {
          this.title = chart.ChartTitle!;
          this.keyTitle = chart.KeyTitle;
          this.batchId = chart.BactchId!;
          this.productName = chart.ProductName!;
          if (chart.ChartData!.length !== 0) {
            this.bubbleChartData = chart.ChartData!.filter((data) => data);
          }
          this.bubbleColors = chart.Color!.filter((data) => data);
          console.log(this.bubbleColors);
          this.fontColor = chart.FontColor!;
          this.fontSize = chart.FontSize!;
          this.height = chart.Height!;
          this.width = chart.Width!;
        }
      });
    });
  }

  private assignValues() {
    this.title = this.bubbleChart.ChartTitle!;
    this.keyTitle = this.bubbleChart.KeyTitle;
    this.batchId = this.bubbleChart.BactchId!;
    this.productName = this.bubbleChart.ProductName!;
    if (this.bubbleChart.ChartData!.length !== 0) {
      this.bubbleChartData = this.bubbleChart.ChartData!.filter((data) => data);
    }
    this.bubbleColors = this.bubbleChart.Color!.filter((data) => data);
    console.log(this.bubbleColors);
    this.fontColor = this.bubbleChart.FontColor!;
    this.fontSize = this.bubbleChart.FontSize!;
    this.height = this.bubbleChart.Height!;
    this.width = this.bubbleChart.Width!;
    this.setLabels();
    this.setValues();
    this.setColors();
  }

  private saveChart(chart: any) {
    console.log('chart', chart);
    chart = {
      ...chart,
      Type: bubblechart,
    };

    let status = this.dndService.getSavedStatus(chart.WidgetId);
    if (status === false) {
      this.composerService.saveChart(chart).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          console.log(err);
          this.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.openSnackBar('Saved!!');
          this.dndService.setSavedStatus(chart.WidgetId);
          this.dialog.closeAll();
        },
      });
    } else {
      this.composerService.updateChart(chart).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          console.log(err);
          this.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.openSnackBar('Saved!!');
          this.dialog.closeAll();
        },
      });
    }
  }

  public onQuerySuccess(event: any) {
    this.tabIndex = 1;
  }

  setLabels() {
    this.labels = [];
    this.bubbleChartData.map((data) => {
      this.labels.push(data.Name);
    });
  }

  setValues() {
    this.values = [];
    this.bubbleChartData.map((data) => {
      this.values.push(data.Value);
    });
  }

  setColors() {
    if (this.bubbleColors.length === 0) {
      let count = this.bubbleChartData.length;
      for (let i = 0; i < count; i++) {
        this.bubbleColors.push('#69b3a2');
      }
    }
  }

  public drawChart() {
    this.setColors();
    this.setValues();
    this.setLabels();
    this.chartData = {
      labels: this.labels,
      datasets: [
        {
          label: this.title,
          data: [
            { x: 10, y: 10, r: 10 },
            { x: 15, y: 5, r: 15 },
            { x: 26, y: 12, r: 23 },
            { x: 7, y: 8, r: 8 },
          ],
          backgroundColor: this.bubbleColors,
          borderWidth: 0,
          hoverBackgroundColor: this.bubbleColors,
        },
      ],
    };

    this.bubbleChartOptions = {
      animation: {
        duration: 0,
      },
      responsive: true,
      scales: {
        x: {
          min: 0,
          title: {
            display: true,
            text: this.xName,
            font: {
              size: this.fontSize,
            },
            color: this.fontColor,
          },
          ticks: {},
        },
        y: {
          min: 0,
          title: {
            display: true,
            text: this.yName,
            font: {
              size: this.fontSize,
            },
            color: this.fontColor,
          },
          ticks: {},
        },
      },
    };
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar'],
      duration: 5 * 1000,
    });
  }
}
