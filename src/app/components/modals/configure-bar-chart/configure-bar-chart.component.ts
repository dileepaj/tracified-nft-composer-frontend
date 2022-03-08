import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { addBarChart } from 'src/app/store/nft-state-store/nft.actions';
import { selectNFT } from 'src/app/store/nft-state-store/nft.selector';

@Component({
  selector: 'app-configure-bar-chart',
  templateUrl: './configure-bar-chart.component.html',
  styleUrls: ['./configure-bar-chart.component.scss'],
})
export class ConfigureBarChartComponent implements OnInit {
  //data that are being displayed in the bar chart
  data: any = [
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

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.updateChart();
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
    this.data.push({
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
    this.drawBars(this.data);
  }

  //delete a field in bar chart
  deleteField(_id: number) {
    this.data = this.data.filter((value: any) => value._id !== _id);
    this.updateChart();
  }

  //add barchart to redux store
  addtoBarcharToNFT() {
    this.store.dispatch(
      addBarChart({
        keyTitle: 'country',
        chartId: '1',
        valueTitle: 'population',
        data: [{ key: 'Us', value: 123 }],
        color: ['black', 'red'],
        xAxis: 'people',
        yAxis: 'country',
        fontColor: 'black',
        fontSize: '22px',
        xSize: `400px`,
        ySize: `500px`,
      })
    );
  }

  showChart() {
    console.log('-------------------------------------------');
    let nft = this.store.select(selectNFT);
    console.log('++++++++++++++++++++++++++-', nft);
  }
}
