import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { Chart, Data } from '../../../../models/nft-content/chart';
import { AppState } from 'src/app/store/app.state';
import {
  addBarChart,
  updateBarChart,
} from 'src/app/store/nft-state-store/nft.actions';
import { NFTState } from 'src/app/store/nft-state-store/nft.reducer';
import {
  selectBarCharts,
  selectNFT,
  selectNFTContent,
  selectProjectStatus,
} from 'src/app/store/nft-state-store/nft.selector';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { barchart } from 'src/models/nft-content/widgetTypes';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DndServiceService } from 'src/app/services/dnd-service.service';

@Component({
  selector: 'app-configure-bar-chart',
  templateUrl: './configure-bar-chart.component.html',
  styleUrls: ['./configure-bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigureBarChartComponent implements OnInit {
  nft$: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  barChart: Chart;
  chartId: any;
  projectId: string = '';
  keyTitle: string;
  batchId: any = '';
  productName: string = '';
  query: string = '';
  //data that are being displayed in the bar chart
  barChartData: Data[] = [
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

  barColors: any[] = ['#69b3a2', '#69b3a2', '#69b3a2', '#69b3a2', '#69b3a2']; //bar colors
  domain: number[] = [0, 1000]; //domain of the bar chart
  min: number = 0; //domain minimum value
  max: number = 1000; //domain maximum value
  counter: number = 1; //counter to count total number of values in data array
  title: string = '';
  xName: any = 'X axis'; //x axis name
  yName: any = 'Y axis'; //y axis name
  fontSize: number = 10; //font size
  fontColor: string = '#000000'; //font color
  tabcolor = '#69b3a2';

  //other values required to generate the bar chart
  private svg: any;
  private margin = 50;
  private width = 550 - this.margin * 2;
  private height = 200 - this.margin * 2;

  saving: boolean = false;

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private composerService: ComposerBackendService,
    private _snackBar: MatSnackBar,
    private dndService: DndServiceService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    //this.updateChart();
    this.chartId = this.data.id;
    this.barChart = this.data.widget;
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
      .domain(data.map((d) => d.Name))
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
      .style('fill', this.fontColor)
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
      .style('fill', this.fontColor)
      .style('font-size', this.fontSize + 'px')
      .text(this.yName);

    // Create and fill the bars
    this.svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.Name))
      .attr('y', (d: any) => y(d.Value))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => this.height - y(d.Value))
      .attr('fill', (d: any, i: number) => this.barColors[i])
      .style('font-size', this.fontSize + 'px');
  }

  //update chart with new values
  updateChart() {
    d3.select('svg').remove();
    this.createSvg();
    this.drawBars(this.barChartData);
  }

  //delete a field in bar chart
  deleteField(_id: number) {
    this.barChartData = this.barChartData.filter(
      (value: any) => value._id !== _id
    );
    this.updateChart();
  }

  //called when user moves to a different tab
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1) {
      //this.getBarChart();
      this.assignValues();
      this.updateChart();
    }
  }

  //update redux store
  updateReduxState() {
    this.saving = true;
    this.barChart = {
      ...this.barChart,
      ChartTitle: this.title,
      Query: this.query,
      ChartData: this.barChartData,
      Color: this.barColors,
      FontColor: this.fontColor,
      FontSize: this.fontSize,
      XAxis: this.xName,
      YAxis: this.yName,
      Height: 200,
      Width: 500,
      Domain: this.domain,
    };

    this.saveChart(this.barChart);
    this.barChart = {
      ...this.barChart,
      Height: this.height,
      Width: this.width,
    };
    this.store.dispatch(updateBarChart({ chart: this.barChart }));
  }

  //get chart from redux store
  private getBarChart() {
    this.store.select(selectBarCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.chartId) {
          this.title = chart.ChartTitle!;
          this.batchId = chart.BactchId!;
          this.productName = chart.ProductName!;
          this.keyTitle = chart.KeyTitle!;
          this.projectId = chart.ProjectId!;
          if (chart.ChartData!.length !== 0) {
            this.barChartData = chart.ChartData!.filter((data) => data);
          }
          this.barColors = chart.Color!.filter((data) => data);
          this.fontColor = chart.FontColor!;
          this.fontSize = chart.FontSize!;
          this.xName = chart.XAxis;
          this.yName = chart.YAxis;
          this.height = chart.Height!;
          this.width = chart.Width!;
        }
      });
    });
  }

  private assignValues() {
    this.title = this.barChart.ChartTitle!;
    this.batchId = this.barChart.BactchId!;
    this.productName = this.barChart.ProductName!;
    this.keyTitle = this.barChart.KeyTitle!;
    this.projectId = this.barChart.ProjectId!;
    if (this.barChart.ChartData!.length !== 0) {
      this.barChartData = this.barChart.ChartData!.filter((data) => data);
    }
    this.barColors = this.barChart.Color!.filter((data) => data);
    this.fontColor = this.barChart.FontColor!;
    this.fontSize = this.barChart.FontSize!;
    this.xName = this.barChart.XAxis;
    this.yName = this.barChart.YAxis;
    this.height = this.barChart.Height!;
    this.width = this.barChart.Width!;
  }

  private saveChart(chart: any) {
    console.log('chart', chart);
    chart = {
      ...chart,
      Type: barchart,
    };
    let status = this.dndService.getSavedStatus(chart.WidgetId);
    console.log(status);

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
          //this.openSnackBar('Saved!!');
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
          //this.openSnackBar('Saved!!');
          this.dialog.closeAll();
        },
      });
    }
  }

  public addQuery(event: any) {
    console.log(event);
    this.query = event;
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar'],
      duration: 5 * 1000,
    });
  }
}
