import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { addBarChart } from 'src/app/store/nft-state-store/nft.actions';
import { selectNFT } from 'src/app/store/nft-state-store/nft.selector';

@Component({
  selector: 'app-configure-pie-chart',
  templateUrl: './configure-pie-chart.component.html',
  styleUrls: ['./configure-pie-chart.component.scss'],
})
export class ConfigurePieChartComponent implements OnInit {
  //data to be displayed in the pie chart
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

  //pie chart field colors
  fieldColors: string[] = [
    '#c7d3ec',
    '#a5b8db',
    '#879cc4',
    '#677795',
    '#5a6782',
  ];
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

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.updateChart();
  }

  //generate bar chart
  private createSvg(): void {
    this.svg = d3
      .select('#pie')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private createColors(): void {
    this.colors = d3
      .scaleOrdinal()
      .domain(this.data.map((d: any) => d.value.toString()))
      .range(this.fieldColors);
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.value));

    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(this.radius))
      .attr('fill', (d: any, i: any) => this.colors(i))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

    // Add labels
    const labelLocation = d3.arc().innerRadius(100).outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('text')
      .text((d: any) => d.data.name)
      .attr(
        'transform',
        (d: any) => 'translate(' + labelLocation.centroid(d) + ')'
      )
      .style('text-anchor', 'middle')
      .style('font-size', this.fontSize + 'px');

    this.svg
      .append('g')
      .append('text')
      .attr('y', this.height - 300)
      .attr('x', this.width / 2 - 165)
      .text(this.title)
      .style('text-anchor', 'middle')
      .style('font-size', this.fontSize + 'px')
      .attr('stroke', this.fontColor);
  }

  //update chart with new values
  updateChart() {
    d3.select('svg').remove();
    this.createSvg();
    this.createColors();
    this.drawChart();
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
