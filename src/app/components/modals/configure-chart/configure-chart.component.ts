import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { addBarChart } from 'src/app/store/nft-state-store/nft.actions';
import { selectNFT } from 'src/app/store/nft-state-store/nft.selector';

@Component({
  selector: 'app-configure-chart',
  templateUrl: './configure-chart.component.html',
  styleUrls: ['./configure-chart.component.scss'],
})
export class ConfigureChartComponent implements OnInit {
  data: any = [
    {
      _id: 1,
      name: 'Field 1',
      value: 500,
      color: '#69b3a2',
    },
  ];
  barColors: string[] = ['#69b3a2'];
  domain: number[] = [0, 1000];
  min: number = 0;
  max: number = 1000;

  counter: number = 1;

  ngOnInit(): void {
    this.updateChart();
  }

  private svg: any;
  private margin = 50;
  private width = 550 - this.margin * 2;
  private height = 200 - this.margin * 2;
  constructor(private store:Store) {}

  addtoBarcharToNFT(){
    this.store.dispatch(addBarChart({   
      keyTitle:"country",
      chartId:"1",
      valueTitle:"population",
      data:[{"key":"Us","value":123}], 
      color:["black","red"],
      xAxis:'people',
      yAxis:'country',
      fontColor:'black',
      fontSize:'22px',
      xSize:`400px`,
      ySize:`500px`,}));
  }

    showChart() {
    console.log('-------------------------------------------');
   let nft= this.store.select(selectNFT)
   console.log('++++++++++++++++++++++++++-',nft);
  }

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
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3
      .scaleLinear()
      .domain([this.min, this.max])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append('g').call(d3.axisLeft(y));

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
      .attr('fill', (d: any, i: number) => this.data[i].color)
      .style('font-size', '30px');
  }

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

  updateChart() {
    d3.select('svg').remove();
    this.createSvg();
    this.drawBars(this.data);
  }

  deleteField(_id: number) {
    this.data = this.data.filter((value: any) => value._id !== _id);
    this.updateChart();
  }
}
