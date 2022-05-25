import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { Chart, Data } from '../../../../models/nft-content/chart';
import { AppState } from 'src/app/store/app.state';
import {
  addBarChart,
  addPieChart,
  deleteQueryResult,
  projectStatus,
  updatePieChart,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectNFT,
  selectNFTContent,
  selectPieCharts,
  selectProjectStatus,
  selectQueryResult,
} from 'src/app/store/nft-state-store/nft.selector';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { piechart } from 'src/models/nft-content/widgetTypes';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { ChartOptions, Chart as chrt } from 'chart.js';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-configure-pie-chart',
  templateUrl: './configure-pie-chart.component.html',
  styleUrls: ['./configure-pie-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigurePieChartComponent implements OnInit {
  nft$: any;
  tabIndex: number = 0;
  pieChart: Chart;
  chartId: any;
  myChart: chrt;
  keyTitle: any;
  query: string = '';
  batchId: any = '';
  productName: string = '';
  chartData: any;
  pieChartOptions: any;
  loadedFromRedux: boolean = false;
  newProject: boolean;
  //data to be displayed in the pie chart
  pieChartData: Data[] = [];
  chartImage: string;

  //pie chart field colors
  fieldColors: any[] = [];
  counter: number = 1; //counter to count the number of values in data array
  title: string = 'Pie Chart Title'; //pie chart title
  fontSize: number = 12; //font size
  fontColor: string = '#000000'; //font color

  //other values required to generate the pie chart
  private svg: any;
  private margin = 10;
  private width = 350;
  private height = 500;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;

  saving: boolean = false;

  labels: any[];
  values: any[];

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private composerService: ComposerBackendService,
    private dndService: DndServiceService,
    private popupMsgService: PopupMessageService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
    this.store.select(selectProjectStatus).subscribe((status) => {
      this.newProject = status;
    });
  }

  ngOnInit(): void {
    this.chartId = this.data.id;
    this.pieChart = this.data.widget;
    this.query = this.pieChart.Query!;
    chrt.register(ChartDataLabels);
  }

  /**
   * @function setValueToPieChart - take value from  query result store by wigetId and se it as a barChart data
   */
  private setValueToPieChart() {
    this.store.select(selectQueryResult).subscribe((data) => {
      let pieChartvalue = data.find((v) => v.WidgetId === this.data.id);

      if (
        !!pieChartvalue &&
        pieChartvalue != undefined &&
        pieChartvalue.queryResult != ''
      ) {
        let pcData = JSON.stringify(pieChartvalue.queryResult);
        let dta = eval(pcData);
        let a = JSON.parse(dta);
        let b: Data[] = [];
        //let val : string;
        a.val.ChartData.map((data: any) => {
          let val = parseFloat(data.Value);
          b.push({ Name: data.Name, Value: val });
        });
        this.pieChartData = b;

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
    this.store.select(selectQueryResult).subscribe((data) => {
      if (data.length != 0 && data.some((e) => e.WidgetId === this.data.id)) {
        buttonState = true;
      }
    });
    return buttonState;
  }

  /**
   * @function tabChanged - called when user moves to a different tab
   */
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1) {
      this.assignValues();

      this.setValueToPieChart();

      this.drawChart();
    }
  }

  /**
   * @function updateReduxState - update redux state
   */
  public updateReduxState() {
    this.saving = true;

    this.pieChart = {
      ...this.pieChart,
      ChartTitle: this.title,
      Query: this.query,
      ChartData: this.pieChartData,
      ChartImage: this.chartImage,
      Color: this.fieldColors,
      FontColor: this.fontColor,
      FontSize: this.fontSize,
      Height: 350,
      Width: 500,
    };

    this.saveChart(this.pieChart);

    this.pieChart = {
      ...this.pieChart,
      Height: this.height,
      Width: this.width,
    };

    this.store.dispatch(updatePieChart({ chart: this.pieChart }));
  }

  /**
   * @function getPieChart - get chart from redux store
   */
  private getPieChart() {
    this.store.select(selectPieCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.chartId) {
          this.title = chart.ChartTitle!;
          this.keyTitle = chart.KeyTitle;
          this.batchId = chart.BactchId!;
          this.productName = chart.ProductName!;
          if (chart.ChartData!.length !== 0) {
            this.pieChartData = chart.ChartData!.filter((data) => data);
          }
          this.chartImage = chart.ChartImage!;
          this.fieldColors = chart.Color!.filter((data) => data);
          this.fontColor = chart.FontColor!;
          this.fontSize = chart.FontSize!;
          this.height = chart.Height!;
          this.width = chart.Width!;
        }
      });
    });
  }

  /**
   * @function onCancel - delete chart data from redux and delete the pie chart widget
   */
  public onCancel() {
    if (this.pieChart.Query === undefined || this.pieChart.Query === '') {
      this.store.dispatch(
        deleteQueryResult({
          queryResult: { WidgetId: this.pieChart.WidgetId, queryResult: '' },
        })
      );
      this.dialog.closeAll();
    } else {
      this.dialog.closeAll();
    }
  }

  /**
   * @function assignValues - assign values to the pie chart
   */
  private assignValues() {
    if (!this.loadedFromRedux) {
      this.title = this.pieChart.ChartTitle!;
      this.keyTitle = this.pieChart.KeyTitle;
      this.batchId = this.pieChart.BactchId!;
      this.productName = this.pieChart.ProductName!;
      if (this.pieChart.ChartData!.length !== 0) {
        this.pieChartData = this.pieChart.ChartData!.filter((data) => data);
      }
      this.chartImage = this.pieChart.ChartImage!;
      this.fieldColors = this.pieChart.Color!.filter((data) => data);
      this.fontColor = this.pieChart.FontColor!;
      this.fontSize = this.pieChart.FontSize!;
      this.height = this.pieChart.Height!;
      this.width = this.pieChart.Width!;
      this.loadedFromRedux = true;
      this.setValues();
      this.setLabels();
      this.setColors();
    }
  }

  /**
   * @function saveChart - delete chart data from redux and delete the pie chart widget
   * @param chart
   */
  private saveChart(chart: any) {
    chart = {
      ...chart,
      Type: piechart,
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
          this.dialog.closeAll();
        },
      });
    }
  }

  /**
   * @function onQuerySuccess - event on query success
   * @param event
   */
  public onQuerySuccess(event: any) {
    this.tabIndex = 1;
    this.query = event.query;
  }

  /**
   * @function getRandomColor - return a randomly generated color code
   */
  private getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * @function setLables - set lables for the pie chart
   */
  private setLabels() {
    this.labels = [];
    this.pieChartData.map((data, index) => {
      let percentage = this.getPercentage(this.values[index]);
      this.labels.push(`${data.Name} - ${this.values[index]} (${percentage})`);
    });
  }

  /**
   * @function setValues - set values for the pie chart
   */
  private setValues() {
    this.values = [];
    this.pieChartData.map((data) => {
      this.values.push(data.Value);
    });
  }

  /**
   * @function setColors - set colors for the pie chart
   */
  private setColors() {
    if (this.fieldColors.length === 0) {
      let count = this.pieChartData.length;
      for (let i = 0; i < count; i++) {
        this.fieldColors.push(this.getRandomColor());
      }
    }
  }

  /**
   * @function getPercentage - get the percentage
   */
  private getPercentage(value: number) {
    let sum = 0;
    this.values.forEach((val) => {
      sum += val;
    });
    let percentage = ((value * 100) / sum).toFixed(2) + '%';
    return percentage;
  }

  /**
   * @function drawChart - draw the pie chart
   */
  public drawChart() {
    if (this.myChart !== undefined) {
      this.myChart.destroy();
    }

    const canvas = <HTMLCanvasElement>document.getElementById('pie-chart');
    const ctx = canvas.getContext('2d')!;

    this.myChart = new chrt(ctx, {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.values,
            backgroundColor: this.fieldColors,
            borderWidth: 0,
            hoverBackgroundColor: this.fieldColors,
          },
        ],
      },
      options: {
        animation: {
          duration: 0,
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: { size: this.fontSize },
              color: this.fontColor,
            },
          },
          title: {
            display: true,
            text: this.title,
            color: this.fontColor,
            font: { size: this.fontSize },
          },
          datalabels: {
            color: this.fontColor,
            display: 'auto',
            font: {
              weight: 'bold',
              size: 12,
            },
            formatter: (value) => {
              let percentage = this.getPercentage(value);
              return percentage;
            },
          },
        },
      },
    });

    this.chartImage = this.myChart.toBase64Image();
  }
}
