import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  addPieChart,
  deletePieChart,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectCardStatus,
  selectNFTContent,
  selectPieCharts,
} from 'src/app/store/nft-state-store/nft.selector';
import { Chart } from 'src/models/nft-content/chart';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { piechart } from 'src/models/nft-content/widgetTypes';
import { ConfigurePieChartComponent } from '../../modals/configure-pie-chart/configure-pie-chart.component';
import { WidgetContentComponent } from '../../modals/widget-content/widget-content.component';

@Component({
  selector: 'app-pie-chart-widget',
  templateUrl: './pie-chart-widget.component.html',
  styleUrls: ['./pie-chart-widget.component.scss'],
})
export class PieChartWidgetComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  pieChart: Chart;
  nftContent: NFTContent;

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private service: DndServiceService,
    private composerService: ComposerBackendService
  ) {
    this.store.select(selectNFTContent).subscribe((content) => {
      this.nftContent = content;
    });
  }

  ngOnInit(): void {
    if (!this.service.widgetExists(this.id)) {
      this.addPieChartToStore();
    } else {
      this.getPieChart();
    }
  }

  //open canfiguration popup
  openDialog() {
    this.getPieChart();
    const dialogRef = this.dialog.open(ConfigurePieChartComponent, {
      data: {
        id: this.id,
        widget: this.pieChart,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }

  otpAdded(): boolean {
    let buttonState = false;
    this.store.select(selectCardStatus).subscribe((data) => {
      if (data.some((e) => e.WidgetId === this.id)) {
        buttonState = true;
      }
    });
    return buttonState;
  }

  //delete pie chart
  deleteWidget() {
    this.composerService.deleteChart(this.id).subscribe({
      next: (res) => {},
      error: (err) => {
        alert('Error');
      },
      complete: () => {
        this.store.dispatch(deletePieChart({ chart: this.pieChart }));
        this.onDeleteWidget.emit(this.id);
      },
    });
  }

  //add pie chart to the store
  private addPieChartToStore() {
    this.pieChart = {
      WidgetId: this.id,
      ProjectId: this.nftContent.ProjectId,
      ProjectName: this.nftContent.ProjectName,
      WidgetType: piechart,
      ChartTitle: 'Pie Chart',
      KeyTitle: 'Name',
      ValueTitle: 'Value',
      ChartData: [],
      Color: [
        '#c7d3ec',
        '#a5b8db',
        '#879cc4',
        '#677795',
        '#5a6782',
        '#c7d3ec',
        '#a5b8db',
        '#879cc4',
        '#677795',
        '#5a6782',
      ],
      FontColor: '#000000',
      FontSize: 12,
      Height: 500,
      Width: 350,
    };
    this.store.dispatch(addPieChart({ chart: this.pieChart }));
    this.getPieChart();
    this.service.updateUsedStatus(this.id);
  }

  //get pie chart from redux store
  private getPieChart() {
    this.store.select(selectPieCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.id) {
          this.pieChart = chart;
        }
      });
    });
  }

  //open batch selection popup
  openAddData() {
    this.getPieChart();
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        userId: this.nftContent.UserId,
        widget: this.pieChart,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }
}
