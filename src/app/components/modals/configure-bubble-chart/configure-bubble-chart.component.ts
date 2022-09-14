import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { AppState } from 'src/app/store/app.state';
import {
  addBubbleChart,
  addQueryResult,
  deleteQueryResult,
  projectUnsaved,
  updateBubbleChart,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectBubbleCharts,
  selectNFTContent,
  selectQueryResult,
} from 'src/app/store/nft-state-store/nft.selector';
import { Chart, Data } from 'src/models/nft-content/chart';
import { bubblechart } from 'src/models/nft-content/widgetTypes';
import { Chart as chrt } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BreakpointObserver } from '@angular/cdk/layout';

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
  myChart: chrt;
  keyTitle: any;
  query: string = '';
  batchId: any = '';
  productName: string = '';
  chartData: any;
  bubbleChartOptions: any;
  labels: string[] = [];
  values: any = [];
  loadedFromRedux: boolean = false;
  //data to be displayed in the pie chart
  bubbleChartData: Data[] = [];
  chartImage: string;
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
  queryExecuted: boolean = false;
  querySuccess: boolean = false;
  fieldControlEnabledIndex: number = -1;
  newFieldData: string = '';
  prevResults: string = '';

  private svg: any;
  private margin = 5;
  private width = 300 - this.margin;
  private height = 300 - this.margin;

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
    private dndService: DndServiceService,
    private popupMsgService: PopupMessageService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    this.chartId = this.data.id;
    this.bubbleChart = this.data.widget;
    this.query = this.bubbleChart.Query!;
    if (this.bubbleChart.QuerySuccess) {
      this.querySuccess = true;
    }
    chrt.unregister(ChartDataLabels);
    this.detectBreakpoint();
  }

  //detect width
  private detectBreakpoint(): void {
    this.breakpointObserver
      .observe(['(max-width: 1375px)'])
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
   * @function setValueToBubblerChart - set values to bubble chart
   */
  private setValueToBubblerChart() {
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
          b.push({ Name: data.Name.substring(0, 20), Value: val });
        });

        this.bubbleChartData = b;

        this.setLabels();
        this.setValues();
        this.setColors();
      }
    });
  }

  /**
   * @function tabChanged - called when user moves to a different tab
   * @param tabChangeEvent
   */
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1) {
      this.assignValues();
      if (
        this.bubbleChartData.length === 0 ||
        (this.queryExecuted && this.querySuccess)
      ) {
        this.setValueToBubblerChart();
      }
      this.drawChart();
    }
  }

  /**
   * @function onCancel - removes the bar chart from redux
   */
  public onCancel() {
    if (this.bubbleChart.Query === undefined || this.bubbleChart.Query === '') {
      this.store.dispatch(
        deleteQueryResult({
          queryResult: { WidgetId: this.bubbleChart.WidgetId, queryResult: '' },
        })
      );
      this.dialog.closeAll();
    } else {
      if (this.querySuccess && !this.bubbleChart.QuerySuccess) {
        this.store.dispatch(
          deleteQueryResult({
            queryResult: {
              WidgetId: this.bubbleChart.WidgetId,
              queryResult: '',
            },
          })
        );
      } else if (this.querySuccess && this.bubbleChart.QuerySuccess) {
        this.store.dispatch(
          addQueryResult({
            queryResult: {
              WidgetId: this.bubbleChart.WidgetId,
              queryResult: this.prevResults,
            },
          })
        );
      }
      this.dialog.closeAll();
    }
  }

  /**
   * @function updateReduxState - update redux store
   */
  public updateReduxState() {
    this.saving = true;
    if (!this.queryExecuted || (this.queryExecuted && this.querySuccess)) {
      this.assignValues();
      this.bubbleChart = {
        ...this.bubbleChart,
        ChartTitle: this.title,
        Query: this.query,
        ChartData: this.bubbleChartData,
        ChartImage: this.chartImage || 'string',
        Color: this.bubbleColors,
        Radius: this.radius,
        FontColor: this.fontColor,
        FontSize: this.fontSize,
        Height: 300,
        Width: 500,
        QuerySuccess: true,
      };
    } else {
      this.store.dispatch(
        deleteQueryResult({
          queryResult: { WidgetId: this.data.id, queryResult: '' },
        })
      );

      this.bubbleChart = {
        ...this.bubbleChart,
        Domain: [0, this.max],
        ChartTitle: 'Bubble Chart',
        KeyTitle: 'Name',
        ValueTitle: 'Value',
        ChartData: [],
        Color: [],
        FontColor: '#000000',
        FontSize: 12,
        Height: 295,
        Width: 295,
        Query: this.query,
        QuerySuccess: false,
        ChartImage: 'string',
      };
    }

    this.saveChart(this.bubbleChart);
    this.bubbleChart = {
      ...this.bubbleChart,
      Height: this.height,
      Width: this.width,
    };
    this.store.dispatch(updateBubbleChart({ chart: this.bubbleChart }));
  }

  /**
   * @function getBubbleChart - get chart from redux store
   */
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
          this.chartImage = chart.ChartImage!;
          this.bubbleColors = chart.Color!.filter((data) => data);
          this.fontColor = chart.FontColor!;
          this.fontSize = chart.FontSize!;
          this.height = chart.Height!;
          this.width = chart.Width!;
        }
      });
    });
  }

  /**
   * @function assignValues - assign values to the bubble chart
   */
  private assignValues() {
    if (!this.loadedFromRedux) {
      this.title = this.bubbleChart.ChartTitle!;
      this.keyTitle = this.bubbleChart.KeyTitle;
      this.batchId = this.bubbleChart.BactchId!;
      this.productName = this.bubbleChart.ProductName!;
      if (this.bubbleChart.ChartData!.length !== 0) {
        this.bubbleChartData = this.bubbleChart.ChartData!.filter(
          (data) => data
        );
      }
      this.chartImage = this.bubbleChart.ChartImage!;
      this.bubbleColors = this.bubbleChart.Color!.filter((data) => data);
      this.fontColor = this.bubbleChart.FontColor!;
      this.fontSize = this.bubbleChart.FontSize!;
      this.height = this.bubbleChart.Height!;
      this.width = this.bubbleChart.Width!;
      this.loadedFromRedux = true;
      this.setLabels();
      this.setValues();
      this.setColors();
    }
  }

  /**
   * @function saveChart - calls the save chart endpoint and save chart data on DB
   * @param chart
   */
  private saveChart(chart: any) {
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
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.popupMsgService.openSnackBar('Chart saved successfully!');
          this.dndService.setSavedStatus(chart.WidgetId);
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
   * @function onQueryResult - calls the save chart endpoint and save chart data on DB
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

  public enableFieldOptions(index: number) {
    this.fieldControlEnabledIndex = index;
  }

  public disableFieldOptions() {
    this.newFieldData = '';
    this.fieldControlEnabledIndex = -1;
  }

  public saveFieldName() {
    let item = this.bubbleChartData[this.fieldControlEnabledIndex];
    item = {
      ...item,
      Name: this.newFieldData,
    };

    this.bubbleChartData[this.fieldControlEnabledIndex] = item;
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
   * @function setLabels - set labels to the chart
   */
  private setLabels() {
    this.labels = [];
    this.bubbleChartData.map((data) => {
      this.labels.push(data.Name);
    });
  }

  /**
   * @function setValues - set values to the chart
   */
  private setValues() {
    this.values = [];
    let i = 0;
    this.bubbleChartData.map((data) => {
      this.values.push({
        label: data.Name,
        data: [{ x: data.X, y: data.Y, r: data.Value }],
        backgroundColor: this.bubbleColors[i],
        borderWidth: 0,
        hoverBackgroundColor: this.bubbleColors[i],
      });
      i++;
    });
  }

  /**
   * @function setColors - set colors to the chart
   */
  private setColors() {
    if (this.bubbleColors.length === 0) {
      let count = this.bubbleChartData.length;
      for (let i = 0; i < count; i++) {
        this.bubbleColors.push('#69b3a2');
      }
    }
  }

  /**
   * @function drawChart - draw the bubble chart
   */
  public drawChart() {
    this.setColors();
    this.setValues();
    this.setLabels();
    if (this.myChart !== undefined) {
      this.myChart.destroy();
    }
    const canvas = <HTMLCanvasElement>document.getElementById('bubble-chart');
    const ctx = canvas.getContext('2d')!;
    this.myChart = new chrt(ctx, {
      type: 'bubble',
      data: {
        labels: [],
        datasets: this.values,
      },
      options: {
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
      },
    });

    this.chartImage = this.myChart.toBase64Image();
  }

  public fontSizeInput(e: any) {
    e.preventDefault();
  }
}
