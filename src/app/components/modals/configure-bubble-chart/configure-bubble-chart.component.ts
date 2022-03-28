import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { AppState } from 'src/app/store/app.state';
import {
  addBubbleChart,
  updateBubbleChart,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectBubbleCharts,
  selectNFTContent,
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
  bubbleChart: Chart;
  chartId: any;
  keyTitle: any;
  query: string = '';
  batchId: any = '';
  productName: string = '';
  //data to be displayed in the pie chart
  bubbleChartData: Data[] = [
    { Name: 'Item 1', X: 100, Y: 60, Value: 1350 },
    { Name: 'Item 2', X: 30, Y: 80, Value: 2500 },
    { Name: 'Item 3', X: 50, Y: 40, Value: 5700 },
    { Name: 'Item 4', X: 190, Y: 100, Value: 30000 },
    { Name: 'Item 5', X: 80, Y: 170, Value: 47500 },
  ];
  bubbleColors: string[] = [
    '#69b3a2',
    '#69b3a2',
    '#69b3a2',
    '#69b3a2',
    '#69b3a2',
  ];
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

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private composerService: ComposerBackendService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    //this.updateChart();
    this.chartId = this.data.id;
    this.bubbleChart = this.data.widget;
  }

  private createSvg(): void {
    this.svg = d3
      .select('#bubble')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  private drawBubbles(
    data: any[],
    bubbleColors: string[],
    radius: number[]
  ): void {
    // Initialize the circle: all located at the center of the svg area

    this.svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function (d: any) {
        return d.X;
      })
      .attr('cy', function (d: any) {
        return d.Y;
      })
      .attr('r', function (d: any) {
        let r = Math.sqrt(d.Value) / Math.PI;
        radius.push(r);
        return r;
      })
      .attr('fill', function (d: any, i: any) {
        return bubbleColors[i];
      });

    this.svg
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('x', function (d: any) {
        let r = d.X + Math.sqrt(d.Value) / Math.PI;

        return r;
      })
      .attr('y', function (d: any) {
        return d.Y + 4;
      })
      .text(function (d: any) {
        return d.Name;
      })
      .style('font-size', this.fontSize + 'px')
      .style('fill', this.fontColor);

    this.svg
      .append('g')
      .append('text')
      .attr('y', this.height - 10)
      .attr('x', this.width / 2)
      .text(this.title)
      .style('text-anchor', 'middle')
      .style('font-size', this.fontSize + 'px')
      .attr('stroke', this.fontColor)
      .style('fill', this.fontColor);
  }

  //update chart with new values
  updateChart() {
    d3.select('svg').remove();
    this.createSvg();
    this.drawBubbles(this.bubbleChartData, this.bubbleColors, this.radius);
  }

  //called when user moves to a different tab
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1) {
      //this.getBubbleChart();
      this.assignValues();
      this.updateChart();
    }
  }

  private showChart() {}

  //update redux store
  updateReduxState() {
    /*this.bubbleChart = {
      WidgetId: this.chartId,
      WidgetType: 'bubble',
      ChartTitle: this.title,
      BactchId: this.batchId,
      ProductName: this.productName,
      KeyTitle: 'name',
      ValueTitle: 'val',
      Query: this.query,
      ChartData: this.bubbleChartData,
      Color: this.bubbleColors,
      Radius: this.radius,
      FontColor: this.fontColor,
      FontSize: this.fontSize,
      Height: this.height,
      Width: this.width,
    };*/

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
  }

  private saveChart(chart: any) {
    console.log('chart', chart);
    chart = {
      ...chart,
      Type: bubblechart,
    };
    this.composerService.saveChart(chart).subscribe({
      next: (res) => {},
      error: (err) => {
        this.saving = false;
        console.log(err);
        alert('An unexpected error occured. Please try again later');
      },
      complete: () => {
        this.saving = false;
        this.dialog.closeAll();
      },
    });
  }

  public addQuery(event: any) {
    console.log(event);
    this.query = event;
  }
}
