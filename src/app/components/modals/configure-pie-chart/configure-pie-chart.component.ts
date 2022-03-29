import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { Chart, Data } from '../../../../models/nft-content/chart';
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
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { piechart } from 'src/models/nft-content/widgetTypes';
import { DndServiceService } from 'src/app/services/dnd-service.service';

@Component({
  selector: 'app-configure-pie-chart',
  templateUrl: './configure-pie-chart.component.html',
  styleUrls: ['./configure-pie-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigurePieChartComponent implements OnInit {
  nft$: any;
  pieChart: Chart;
  chartId: any;
  keyTitle: any;
  query: string = '';
  batchId: any = '';
  productName: string = '';
  //data to be displayed in the pie chart
  pieChartData: Data[] = [
    {
      Name: 'Sri Lanka',
      Value: 200,
    },
    {
      Name: 'India',
      Value: 900,
    },
    {
      Name: 'Bangladesh',
      Value: 800,
    },
    {
      Name: 'Pakistan',
      Value: 600,
    },
    {
      Name: 'Nepal',
      Value: 100,
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

  saving: boolean = false;

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private composerService: ComposerBackendService,
    private dndService: DndServiceService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    //this.updateChart();
    this.chartId = this.data.id;
    this.pieChart = this.data.widget;
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
      .domain(this.pieChartData.map((d: any) => d.Value.toString()))
      .range(this.fieldColors);
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.Value));

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
      .text((d: any) => d.data.Name)
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
      //this.getPieChart();
      this.assignValues();
      this.updateChart();
    }
  }

  //update redux state
  updateReduxState() {
    /*this.pieChart = {
      WidgetId: this.chartId,
      WidgetType: 'pie',
      ChartTitle: this.title,
      BactchId: this.batchId,
      ProductName: this.productName,
      KeyTitle: 'name',
      ValueTitle: 'value',
      Query: this.query,
      ChartData: this.pieChartData,
      Color: this.fieldColors,
      FontColor: this.fontColor,
      FontSize: this.fontSize,
      Height: this.height,
      Width: this.width,
    };*/

    this.saving = true;

    this.pieChart = {
      ...this.pieChart,
      ChartTitle: this.title,
      Query: this.query,
      ChartData: this.pieChartData,
      Color: this.fieldColors,
      FontColor: this.fontColor,
      FontSize: this.fontSize,
      Height: 350,
      Width: 500,
    };

    this.saveChart(this.pieChart);
    this.store.dispatch(updatePieChart({ chart: this.pieChart }));
  }

  //get chart from redux store
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

  private assignValues() {
    this.title = this.pieChart.ChartTitle!;
    this.keyTitle = this.pieChart.KeyTitle;
    this.batchId = this.pieChart.BactchId!;
    this.productName = this.pieChart.ProductName!;
    if (this.pieChart.ChartData!.length !== 0) {
      this.pieChartData = this.pieChart.ChartData!.filter((data) => data);
    }
    this.fieldColors = this.pieChart.Color!.filter((data) => data);
    console.log(this.fieldColors);
    this.fontColor = this.pieChart.FontColor!;
    this.fontSize = this.pieChart.FontSize!;
    this.height = this.pieChart.Height!;
    this.width = this.pieChart.Width!;
  }

  private saveChart(chart: any) {
    console.log('chart', chart);
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
          console.log(err);
          alert('An unexpected error occured. Please try again later');
        },
        complete: () => {
          this.saving = false;
          this.dndService.setSavedStatus(chart.WidgetId);
          this.dialog.closeAll();
        },
      });
    } else {
      this.composerService.updateChart(chart).subscribe({
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
  }

  public addQuery(event: any) {
    console.log(event);
    this.query = event;
  }
}
