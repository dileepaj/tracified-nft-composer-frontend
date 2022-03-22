import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { Chart } from '../../../../models/nft-content/chart';
import { AppState } from 'src/app/store/app.state';
import {
  addBarChart,
  addPieChart,
  updatePieChart,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectNFT,
  selectNFTContent,
  selectPieCharts,
} from 'src/app/store/nft-state-store/nft.selector';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-configure-pie-chart',
  templateUrl: './configure-pie-chart.component.html',
  styleUrls: ['./configure-pie-chart.component.scss'],
})
export class ConfigurePieChartComponent implements OnInit {
  nft$: any;
  private pieChart: Chart;
  chartId: any;
  keyTitle: any;
  query: string = '';
  //data to be displayed in the pie chart
  pieChartData: any = [
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
  fieldColors: any[] = ['#c7d3ec', '#a5b8db', '#879cc4', '#677795', '#5a6782'];
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

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    //this.updateChart();
    this.chartId = this.data.id;
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
      .domain(this.pieChartData.map((d: any) => d.value.toString()))
      .range(this.fieldColors);
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.value));

    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(this.pieChartData))
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(this.radius))
      .attr('fill', (d: any, i: any) => this.fieldColors[i])
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

    // Add labels
    const labelLocation = d3.arc().innerRadius(100).outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.pieChartData))
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
      .attr('stroke', this.fontColor)
      .style('fill', this.fontColor);
  }

  //update chart with new values
  updateChart() {
    d3.select('svg').remove();
    this.createSvg();
    this.createColors();
    this.drawChart();
  }

  private showChart() {}

  //called when user moves to a different tab
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1) {
      this.getPieChart();
      this.updateChart();
    }
  }

  //update redux state
  updateReduxState() {
    this.pieChart = {
      WidgetId: this.chartId,
      ChartTitle: this.title,
      KeyTitle: 'name',
      ValueTitle: 'value',
      Query: this.query,
      ChartData: this.pieChartData,
      Color: this.fieldColors,
      FontColor: this.fontColor,
      FontSize: this.fontSize,
      Height: this.height,
      Width: this.width,
    };

    this.store.dispatch(updatePieChart({ chart: this.pieChart }));
  }

  //get chart from redux store
  private getPieChart() {
    this.store.select(selectPieCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.chartId) {
          this.title = chart.ChartTitle!;
          this.keyTitle = chart.KeyTitle;
          if (chart.ChartData!.length !== 0) {
            this.pieChartData = chart.ChartData!.filter((data) => data);
          }
          this.fieldColors = chart.Color!.filter((data) => data);
          console.log(this.fieldColors);
          this.fontColor = chart.FontColor!;
          this.fontSize = chart.FontSize!;
          this.height = chart.Height!;
          this.width = chart.Width!;
        }
      });
    });
  }
}
