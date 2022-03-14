import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { AppState } from 'src/app/store/app.state';
import {
  addBubbleChart,
  updateBubbleChart,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectBubbleCharts,
  selectNFTContent,
} from 'src/app/store/nft-state-store/nft.selector';
import { Chart } from 'src/models/nft-content/chart';

@Component({
  selector: 'app-configure-bubble-chart',
  templateUrl: './configure-bubble-chart.component.html',
  styleUrls: ['./configure-bubble-chart.component.scss'],
})
export class ConfigureBubbleChartComponent implements OnInit {
  nft$: any;
  private bubbleChart: Chart;
  chartId: any;
  keyTitle: any;
  //data to be displayed in the pie chart
  bubbleChartData: any = [
    { name: 'Item 1', x: 100, y: 60, val: 1350 },
    { name: 'Item 2', x: 30, y: 80, val: 2500 },
    { name: 'Item 3', x: 50, y: 40, val: 5700 },
    { name: 'Item 4', x: 190, y: 100, val: 30000 },
    { name: 'Item 5', x: 80, y: 170, val: 47500 },
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

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    this.updateChart();
    this.chartId = this.data.id;
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
        return d.x;
      })
      .attr('cy', function (d: any) {
        return d.y;
      })
      .attr('r', function (d: any) {
        let r = Math.sqrt(d.val) / Math.PI;
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
        let r = d.x + Math.sqrt(d.val) / Math.PI;

        return r;
      })
      .attr('y', function (d: any) {
        return d.y + 4;
      })
      .text(function (d: any) {
        return d.name;
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
    console.log('chart updated!');
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tab changed');
    if (tabChangeEvent.index === 1) {
      this.getBubbleChart();
      this.updateChart();
    }
  }

  private showChart() {
    console.log('-------------------------------------------');
    console.log('++++++++++++++++++++++++++-', this.nft$);
  }

  updateReduxState() {
    this.bubbleChart = {
      WidgetId: this.chartId,
      ChartTitle: this.title,
      KeyTitle: 'name',
      ValueTitle: 'val',
      ChartData: this.bubbleChartData,
      Color: this.bubbleColors,
      Radius: this.radius,
      FontColor: this.fontColor,
      FontSize: this.fontSize,
      Height: this.height,
      Width: this.width,
    };

    this.store.dispatch(updateBubbleChart({ chart: this.bubbleChart }));
  }

  private getBubbleChart() {
    this.store.select(selectBubbleCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.chartId) {
          this.title = chart.ChartTitle;
          this.keyTitle = chart.KeyTitle;
          if (chart.ChartData.length !== 0) {
            this.bubbleChartData = chart.ChartData.filter((data) => data);
          }
          this.bubbleColors = chart.Color.filter((data) => data);
          console.log(this.bubbleColors);
          this.fontColor = chart.FontColor;
          this.fontSize = chart.FontSize;
          this.height = chart.Height!;
          this.width = chart.Width!;
        }
      });
    });
  }
}
