import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { Chart } from '../../../../models/nft-content/chart';
import { AppState } from 'src/app/store/app.state';
import { addBarChart } from 'src/app/store/nft-state-store/nft.actions';
import { NFTState } from 'src/app/store/nft-state-store/nft.reducer';
import {
  selectNFT,
  selectNFTContent,
} from 'src/app/store/nft-state-store/nft.selector';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-configure-bar-chart',
  templateUrl: './configure-bar-chart.component.html',
  styleUrls: ['./configure-bar-chart.component.scss'],
})
export class ConfigureBarChartComponent implements OnInit {
  nft$: any;
  private barChart: Chart;
  chartId: any;
  //data that are being displayed in the bar chart
  barChartData: any = [
    {
      name: 'Sri Lanka',
      value: 200,
    },
    {
      name: 'India',
      value: 900,
    },
    {
      name: 'Bangladesh',
      value: 800,
    },
    {
      name: 'Pakistan',
      value: 600,
    },
    {
      name: 'Nepal',
      value: 100,
    },
  ];

  barColors: string[] = ['#69b3a2', '#69b3a2', '#69b3a2', '#69b3a2', '#69b3a2']; //bar colors
  domain: number[] = [0, 1000]; //domain of the bar chart
  min: number = 0; //domain minimum value
  max: number = 1000; //domain maximum value
  counter: number = 1; //counter to count total number of values in data array
  title: string = '';
  xName: string = 'X axis'; //x axis name
  yName: string = 'Y axis'; //y axis name
  fontSize: number = 10; //font size
  fontColor: string = '#000000'; //font color
  tabcolor = '#69b3a2';

  //other values required to generate the bar chart
  private svg: any;
  private margin = 50;
  private width = 550 - this.margin * 2;
  private height = 200 - this.margin * 2;

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    //this.updateChart();
    this.chartId = this.data.id;
    console.log(this.data);
  }

  //generate bar chart
  private createSvg(): void {
    this.svg = d3
      .select('#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.name))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .style('color', 'black')
      .append('text')
      .attr('y', this.height - 60)
      .attr('x', this.width - 200)
      .attr('text-anchor', 'end')
      .attr('stroke', this.fontColor)
      .style('font-size', this.fontSize + 'px')
      .text(this.xName);

    // Create the Y-axis band scale
    const y = d3
      .scaleLinear()
      .domain([this.min, this.max])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg
      .append('g')
      .call(d3.axisLeft(y))
      .style('color', 'black')
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '-4.6em')
      .attr('text-anchor', 'end')
      .attr('stroke', this.fontColor)
      .style('font-size', this.fontSize + 'px')
      .text(this.yName);

    // Create and fill the bars
    this.svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.name))
      .attr('y', (d: any) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => this.height - y(d.value))
      .attr('fill', (d: any, i: number) => this.barColors[i])
      .style('font-size', this.fontSize + 'px');
  }

  //add new fields to the bar chart
  addNewField() {
    this.counter++;
    this.barChartData.push({
      _id: this.counter,
      name: 'Field ' + this.counter,
      value: 500,
      color: '#69b3a2',
    });
    this.barColors.push('#69b3a2');
    this.updateChart();
  }

  //update chart with new values
  updateChart() {
    d3.select('svg').remove();
    this.createSvg();
    this.drawBars(this.barChartData);
    console.log('chart updated!');
  }

  //delete a field in bar chart
  deleteField(_id: number) {
    this.barChartData = this.barChartData.filter(
      (value: any) => value._id !== _id
    );
    this.updateChart();
  }

  //add barchart to redux store
  addtoBarCharToNFT() {
    this.barChart = {
      ChartId: this.chartId,
      ChartTitle: this.title,
      KeyTitle: 'name',
      ChartData: this.barChartData,
      Color: this.barColors,
      FontColor: this.fontColor,
      FontSize: this.fontSize,
      XAxis: this.xName,
      YAxis: this.yName,
    };

    this.store.dispatch(addBarChart({ chart: this.barChart }));

    this.showChart();
  }

  private showChart() {
    console.log('-------------------------------------------');
    console.log('++++++++++++++++++++++++++-', this.nft$);
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tab changed');
    if (tabChangeEvent.index === 1) {
      this.updateChart();
    }
  }
}
