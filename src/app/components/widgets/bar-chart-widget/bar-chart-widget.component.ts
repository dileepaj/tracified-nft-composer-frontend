import {
  Component,
  OnInit,
  Inject,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { ConfigureBarChartComponent } from '../../modals/configure-bar-chart/configure-bar-chart.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chart } from 'src/models/nft-content/chart';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  selectBarCharts,
  selectCardStatus,
  selectNFTContent,
} from 'src/app/store/nft-state-store/nft.selector';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import {
  addBarChart,
  deleteBarChart,
} from 'src/app/store/nft-state-store/nft.actions';
import { WidgetContentComponent } from '../../modals/widget-content/widget-content.component';
import { Widget } from '../../views/composer/composer.component';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { barchart } from 'src/models/nft-content/widgetTypes';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { WidgethighlightingService } from 'src/app/services/widgethighlighting.service';

@Component({
  selector: 'app-bar-chart-widget',
  templateUrl: './bar-chart-widget.component.html',
  styleUrls: ['./bar-chart-widget.component.scss'],
})
export class BarChartWidgetComponent implements OnInit, AfterViewInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  barChart: Chart;
  nftContent: NFTContent;
  @Input() widget: Widget;
  icon: any = '../../../../assets/images/widget-icons/Bar-chart.png';
  public highlight = false;

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private service: DndServiceService,
    private composerService: ComposerBackendService,
    private popupMsgService: PopupMessageService,
    private highlightService: WidgethighlightingService
  ) {
    this.store.select(selectNFTContent).subscribe((content) => {
      this.nftContent = content;
    });
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    //check if the widget is already in redux store
    if (!this.service.widgetExists(this.id)) {
      this.addBarChartToStore();
    }
    this.store.select(selectBarCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.id) {
          this.barChart = chart;
        }
      });
    });

    this.highlightService.selectedWidgetChange.subscribe((id) => {
      if (this.barChart.WidgetId === id) {
        this.highlight = true;
      } else {
        this.highlight = false;
      }
    });
  }

  public otpAdded(): boolean {
    let buttonState = false;
    this.store.select(selectCardStatus).subscribe((data) => {
      if (data.some((e) => e.WidgetId === this.id)) {
        buttonState = true;
      }
    });
    return buttonState;
  }

  //open configuration popup
  public openDialog() {
    const dialogRef = this.dialog.open(ConfigureBarChartComponent, {
      data: {
        id: this.id,
        widget: this.barChart,
      },
    });
  }

  ngOnChanges(val: any) {}

  //delete chart from redux
  public deleteWidget() {
    this.composerService.deleteChart(this.id).subscribe({
      next: (res) => {},
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
      complete: () => {
        this.store.dispatch(deleteBarChart({ chart: this.barChart }));
        this.onDeleteWidget.emit(this.id);
      },
    });
  }

  //add chart to redux
  private addBarChartToStore() {
    this.barChart = {
      WidgetId: this.id,
      WidgetType: barchart,
      ProjectId: this.nftContent.ProjectId,
      ProjectName: this.nftContent.ProjectName,
      ChartTitle: 'Bar Chart',
      KeyTitle: 'Name',
      ValueTitle: 'Value',
      ChartData: [],
      Color: [],
      FontColor: '#000000',
      FontSize: 10,
      XAxis: 'X Axis',
      YAxis: 'Y Axis',
      Width: 450,
      Height: 100,
      Query: '',
      QuerySuccess: false,
      ChartImage: 'string',
    };
    this.store.dispatch(addBarChart({ chart: this.barChart }));
    this.service.updateUsedStatus(this.id);
  }

  //open batch selection popup
  public openAddData() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        userId: this.nftContent.UserId,
        widget: this.barChart,
      },
    });
  }
}
