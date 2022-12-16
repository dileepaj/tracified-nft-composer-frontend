import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chart, Data } from '../../../../models/nft-content/chart';
import { AppState } from 'src/app/store/app.state';
import {
  addQueryResult,
  deleteQueryResult,
  projectUnsaved,
  updateBarChart,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectBarCharts,
  selectNFTContent,
  selectQueryResult,
} from 'src/app/store/nft-state-store/nft.selector';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { barchart } from 'src/models/nft-content/widgetTypes';

import { DndServiceService } from 'src/app/services/dnd-service.service';
import { Chart as chrt } from 'chart.js';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-configure-bar-chart',
  templateUrl: './configure-bar-chart.component.html',
  styleUrls: ['./configure-bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigureBarChartComponent implements OnInit {
  nft$: any;
  tabIndex: number = 0;
  barChart: Chart;
  chartId: any;
  myChart: chrt;
  projectId: string = '';
  keyTitle: string;
  batchId: any = '';
  productName: string = '';
  query: string = '';
  querySaved: boolean = false;
  public barChartOptions: any;
  chartData: any;
  labels: string[] = [];
  values: any[] = [];
  qEvent: any;
  querySuccess: boolean = false;
  queryExecuted: boolean = false;
  loadedFromRedux: boolean = false;
  prevResults: string = '';

  //data that are being displayed in the bar chart
  barChartData: Data[] = [];
  chartImage: string;

  barColors: any[] = []; //bar colors
  domain: number[] = [0, 1000]; //domain of the bar chart
  min: number = 0; //domain minimum value
  max: number = 1000; //domain maximum value
  counter: number = 1; //counter to count total number of values in data array
  title: string = '';
  xName: any = 'X axis'; //x axis name
  yName: any = 'Y axis'; //y axis name
  fontSize: number = 10; //font size
  fontColor: string = '#000000'; //font color
  fieldControlEnabledIndex: number = -1;
  newFieldData: string = '';
  screenSize = window.innerWidth;
  private margin = 50;
  private width = 550 - this.margin * 2;
  private height = 200 - this.margin * 2;
  saving: boolean = false;
  rowHeight: string = '550px';
  rowHeightMobile: boolean = false;
  colspan1: string;
  rowHeightEditor: string = '550px';

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private composerService: ComposerBackendService,
    private popupMsgService: PopupMessageService,
    private dndService: DndServiceService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    this.chartId = this.data.id;
    this.barChart = this.data.widget;
    this.query = this.barChart.Query!;
    if (this.barChart.QuerySuccess) {
      this.querySuccess = true;
    }
    chrt.unregister(ChartDataLabels);
    this.detectBreakpoint();
  }

  //detect width
  private detectBreakpoint(): void {
    this.breakpointObserver
      .observe(['(max-width: 876px)'])
      .subscribe((result) => {
        this.rowHeight = result.matches ? '350px' : '550px';
        this.rowHeightMobile = result.matches;
        this.colspan1 = result.matches ? '5' : '3';
      });
    this.breakpointObserver
      .observe(['(max-width: 376px)'])
      .subscribe((result) => {
        this.rowHeightEditor = result.matches ? '400px' : '500px';
      });
  }

  /**
   * @function setValueToBarChart - take value from  query result store by wigetId and se it as a barChart data
   */
  private setValueToBarChart() {
    this.store.select(selectQueryResult).subscribe((data) => {
      let barChartvalue = data.find((v) => v.WidgetId === this.data.id);
      if (
        !!barChartvalue &&
        barChartvalue != undefined &&
        barChartvalue.queryResult != ''
      ) {
        let barChartobject = JSON.stringify(barChartvalue.queryResult);
        let dta = eval(barChartobject);
        let a = JSON.parse(dta);
        let b: Data[] = [];
        //let val : string;
        a.val.ChartData.map((data: any) => {
          let val = parseFloat(data.Value);
          b.push({ Name: data.Name.substring(0, 20), Value: val });
        });

        this.barChartData = b;

        this.setLabels();
        this.setValues();
        this.setColors();
      }
    });
  }

  /**
   * @function CheckQuerySavingStatus - check , executed query save or not  use this function for show the congigure button
   */
  public CheckQuerySavingStatus(): boolean {
    let buttonState = false;
    if (this.queryExecuted) {
      if (this.querySuccess) {
        this.store.select(selectQueryResult).subscribe((data) => {
          if (data.some((e) => e.WidgetId === this.data.id)) {
            buttonState = true;
          }
        });
      }
    } else {
      this.store.select(selectQueryResult).subscribe((data) => {
        if (data.some((e) => e.WidgetId === this.data.id)) {
          buttonState = true;
        }
      });
    }

    return buttonState;
  }

  /**
   * @function tabChanged - called when user moves to a different tab
   * @param tabChangeEvent
   */
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1) {
      this.assignValues();
      if (
        this.barChartData.length === 0 ||
        (this.queryExecuted && this.querySuccess)
      ) {
        this.setValueToBarChart();
      }
      this.drawChart();
    }
  }

  /**
   * @function updateReduxState - update redux store
   */
  public updateReduxState() {
    this.saving = true;
    if (!this.queryExecuted || (this.queryExecuted && this.querySuccess)) {
      this.assignValues();
      this.barChart = {
        ...this.barChart,
        ChartTitle: this.title,
        ChartData: this.barChartData,
        ChartImage: this.chartImage || 'string',
        Color: this.barColors,
        FontColor: this.fontColor,
        FontSize: this.fontSize,
        XAxis: this.xName,
        YAxis: this.yName,
        Height: 200,
        Width: 500,
        Query: this.query,
        QuerySuccess: true,
        Domain: [0, this.max],
      };
    } else {
      this.store.dispatch(
        deleteQueryResult({
          queryResult: { WidgetId: this.data.id, queryResult: '' },
        })
      );

      this.barChart = {
        ...this.barChart,
        Domain: [0, this.max],
        ChartTitle: 'Bar Chart',
        KeyTitle: 'Name',
        ValueTitle: 'Value',
        ChartData: [],
        Color: [],
        FontColor: '#000000',
        FontSize: 10,
        XAxis: 'X Axis',
        YAxis: 'Y Axis',
        Width: 450,
        Height: 100,
        Query: this.query,
        QuerySuccess: false,
        ChartImage: 'string',
      };
    }

    this.saveChart(this.barChart);
    this.store.dispatch(updateBarChart({ chart: this.barChart }));
  }

  /**
   * @function getBarChart - get chart from redux store
   */
  private getBarChart() {
    this.store.select(selectBarCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.chartId) {
          this.title = chart.ChartTitle!;
          this.batchId = chart.BactchId!;
          this.productName = chart.ProductName!;
          this.keyTitle = chart.KeyTitle!;
          this.projectId = chart.ProjectId!;
          if (chart.ChartData!.length !== 0) {
            this.barChartData = chart.ChartData!.filter((data) => data);
          }
          this.chartImage = chart.ChartImage!;
          this.barColors = chart.Color!.filter((data) => data);
          this.fontColor = chart.FontColor!;
          this.fontSize = chart.FontSize!;
          this.xName = chart.XAxis;
          this.yName = chart.YAxis;
          this.height = chart.Height!;
          this.width = chart.Width!;
        }
      });
    });
  }

  /**
   * @function assignValues - assign values from the redux
   */
  private assignValues() {
    if (!this.loadedFromRedux) {
      this.title = this.barChart.ChartTitle!;
      this.batchId = this.barChart.BactchId!;
      this.productName = this.barChart.ProductName!;
      this.keyTitle = this.barChart.KeyTitle!;
      this.projectId = this.barChart.ProjectId!;
      if (this.barChart.ChartData!.length !== 0) {
        this.barChartData = this.barChart.ChartData!.filter((data) => data);
      }
      this.chartImage = this.barChart.ChartImage!;
      this.barColors = this.barChart.Color!.filter((data) => data);
      this.fontColor = this.barChart.FontColor!;
      this.fontSize = this.barChart.FontSize!;
      this.xName = this.barChart.XAxis;
      this.yName = this.barChart.YAxis;
      this.height = this.barChart.Height!;
      this.width = this.barChart.Width!;
      this.loadedFromRedux = true;
      this.setLabels();
      this.setValues();
      this.setColors();
    }
  }

  /**
   * @function saveChart - save the chart on DB
   * @param chart
   */
  private saveChart(chart: any) {
    this.getBarChart();
    chart = {
      ...chart,
      Type: barchart,
    };
    let status = this.dndService.getSavedStatus(chart.WidgetId);
    if (status === false) {
      this.composerService.saveChart(chart).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.dndService.setSavedStatus(chart.WidgetId);
          this.popupMsgService.openSnackBar('Chart saved successfully!');
          this.store.dispatch(projectUnsaved());
          this.dialog.closeAll();
        },
      });
    } else {
      this.composerService.updateChart(chart).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.popupMsgService.openSnackBar('Chart updated successfully!');
          this.store.dispatch(projectUnsaved());
          this.dialog.closeAll();
        },
      });
    }
  }

  /**
   * @function onQueryResult - query success event
   * @param event
   */
  public onQueryResult(event: any) {
    this.query = event.query;
    this.queryExecuted = true;
    this.newFieldData = '';
    this.fieldControlEnabledIndex = -1;
    this.prevResults = event.prevResults;
    if (event.success) {
      this.tabIndex = 1;
      this.querySuccess = true;
    } else {
      this.querySuccess = false;
    }
  }

  /**
   * @function onCancel - cancel even
   */
  public onCancel() {
    if (this.barChart.Query === undefined || this.barChart.Query === '') {
      this.store.dispatch(
        deleteQueryResult({
          queryResult: { WidgetId: this.barChart.WidgetId, queryResult: '' },
        })
      );
      this.dialog.closeAll();
    } else {
      if (this.querySuccess && !this.barChart.QuerySuccess) {
        this.store.dispatch(
          deleteQueryResult({
            queryResult: { WidgetId: this.barChart.WidgetId, queryResult: '' },
          })
        );
      } else if (this.querySuccess && this.barChart.QuerySuccess) {
        this.store.dispatch(
          addQueryResult({
            queryResult: {
              WidgetId: this.barChart.WidgetId,
              queryResult: this.prevResults,
            },
          })
        );
      }
      this.dialog.closeAll();
    }
  }

  public enableFieldOptions(index: number) {
    this.fieldControlEnabledIndex = index;
  }

  public disableFieldOptions() {
    this.newFieldData = '';
    this.fieldControlEnabledIndex = -1;
  }

  public saveFieldName() {
    let item = this.barChartData[this.fieldControlEnabledIndex];
    item = {
      ...item,
      Name: this.newFieldData,
    };

    this.barChartData[this.fieldControlEnabledIndex] = item;
    this.setLabels();
    this.drawChart();
    this.newFieldData = '';
    this.fieldControlEnabledIndex = -1;
  }

  public setFieldName(event: any, index: number) {
    this.fieldControlEnabledIndex = index;
    this.newFieldData = event.target.value;
  }
  /**
   * @function setLabels - set labels on the chart
   */
  private setLabels() {
    this.labels = [];
    this.barChartData.map((data) => {
      this.labels.push(data.Name);
    });
  }

  /**
   * @function setValues - set values on the chart
   */
  private setValues() {
    this.values = [];
    this.barChartData.map((data) => {
      this.values.push(data.Value);
    });
  }

  /**
   * @function setColors - set colors on the chart
   */
  private setColors() {
    if (this.barColors.length === 0) {
      let count = this.barChartData.length;
      for (let i = 0; i < count; i++) {
        this.barColors.push('#69b3a2');
      }
    }
  }

  /**
   * @function drawChart - draws the bar chart
   */
  public drawChart() {
    if (this.myChart !== undefined) {
      this.myChart.destroy();
    }
    const canvas = <HTMLCanvasElement>document.getElementById('bar-chart');
    const ctx = canvas.getContext('2d')!;
    this.myChart = new chrt(ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.title,
            data: this.values,
            backgroundColor: this.barColors,
            borderWidth: 0,
            hoverBackgroundColor: this.barColors,
          },
        ],
      },
      options: {
        animation: {
          duration: 0,
        },
        plugins: {
          title: {
            display: true,
            text: this.title,
            font: {
              size: this.fontSize,
            },
          },
          legend: {
            display: false,
          },
        },
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: this.xName,
              font: {
                size: this.fontSize,
              },
              color: this.fontColor,
            },
            ticks: {
              font:{
                size:13
              }
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: this.yName,
              font: {
                size: this.fontSize,
              },
              color: this.fontColor,
            },
            ticks: {
              font:{
                size:13
              }
            }
          },
        },
      },
    });

    this.chartImage = this.myChart.toBase64Image();
  }

  increment(){
    this.fontSize+=1;
  }
  public fontSizeInput(e: any) {
    e.preventDefault();
  }
}
