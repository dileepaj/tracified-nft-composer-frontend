import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { WidgethighlightingService } from 'src/app/services/widgethighlighting.service';
import { AppState } from 'src/app/store/app.state';
import {
  addPieChart,
  deletePieChart,
  updatePieChart,
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
import { DeleteWidgetComponent } from '../../modals/delete-widget/delete-widget.component';

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
  icon: any = '../../../../assets/images/widget-icons/Pie-chart.png';
  public highlight = false;
  public isEditing: boolean = false;
  public newTitle: string = '';
  private clickedInsideInput: boolean = false;

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

  ngOnInit(): void {
    if (!this.service.widgetExists(this.id)) {
      this.addPieChartToStore();
    }
    this.store.select(selectPieCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.id) {
          this.pieChart = chart;
        }
      });
    });

    this.highlightService.selectedWidgetChange.subscribe((id) => {
      if (this.pieChart.WidgetId === id) {
        this.highlight = true;
      } else {
        this.highlight = false;
      }
    });
  }

  //open canfiguration popup
  public openDialog() {
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

  public otpAdded(): boolean {
    let buttonState = false;
    this.store.select(selectCardStatus).subscribe((data) => {
      if (data.some((e) => e.WidgetId === this.id)) {
        buttonState = true;
      }
    });
    return buttonState;
  }

  //delete pie chart
  public deleteWidget() {
    const dialogRef = this.dialog.open(DeleteWidgetComponent, {
      data: {
        widgetType: 'Pie Chart',
        widgetId: this.id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.store.dispatch(deletePieChart({ chart: this.pieChart }));
        this.onDeleteWidget.emit(this.id);
      }
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
      Color: [],
      FontColor: '#000000',
      FontSize: 12,
      Height: 500,
      Width: 350,
      Query: '',
      QuerySuccess: false,
      ChartImage: 'string',
    };

    this.clickedInsideInput = true;
    this.isEditing = true;
    this.newTitle = '';

    this.store.dispatch(addPieChart({ chart: this.pieChart }));
    this.service.updateUsedStatus(this.id);
  }

  //open batch selection popup
  public openAddData() {
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

  //update database
  public updateInDB() {
    this.composerService.updateChart(this.pieChart).subscribe({
      next: (res) => {},
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
      complete: () => {
        this.popupMsgService.openSnackBar('Pie Chart updated successfully!');
        this.service.setSavedStatus(this.pieChart.WidgetId);
        this.dialog.closeAll();
      },
    });
  }

  //enable editing title
  public enableEditing() {
    this.clickedInsideInput = true;
    this.isEditing = true;
    this.newTitle = this.pieChart.ChartTitle!;
  }

  //called when user types on title input field
  public onChangeTitle(event: any) {
    if (event.target.value.length > 0) {
      this.newTitle = event.target.value;
    }
  }

  //save new ttile
  public saveTitle() {
    this.pieChart = {
      ...this.pieChart,
      ChartTitle: this.newTitle,
    };

    if (this.service.getSavedStatus(this.pieChart.WidgetId)) {
      this.updateInDB();
    }

    this.store.dispatch(updatePieChart({ chart: this.pieChart }));
    this.isEditing = false;
  }

  //called when user clicks on input field
  public onClickInput() {
    this.clickedInsideInput = true;
  }

  public cancel() {
    this.isEditing = false;
    this.newTitle = this.pieChart.ChartTitle!;
  }

  //triggered when useer clicks on anywhere in the document
  @HostListener('document:click')
  clickedOut() {
    if (!this.clickedInsideInput) {
      this.isEditing = false;
      this.newTitle = this.pieChart.ChartTitle!;
    }
    this.clickedInsideInput = false;
  }
}
