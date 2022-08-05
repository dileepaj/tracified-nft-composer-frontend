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
  addBubbleChart,
  deleteBarChart,
  deleteBubbleChart,
  updateBubbleChart,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectBubbleCharts,
  selectCardStatus,
  selectNFTContent,
} from 'src/app/store/nft-state-store/nft.selector';
import { Chart } from 'src/models/nft-content/chart';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { bubblechart } from 'src/models/nft-content/widgetTypes';
import { ConfigureBubbleChartComponent } from '../../modals/configure-bubble-chart/configure-bubble-chart.component';
import { WidgetContentComponent } from '../../modals/widget-content/widget-content.component';
import { DeleteWidgetComponent } from '../../modals/delete-widget/delete-widget.component';

@Component({
  selector: 'app-bubble-chart-widget',
  templateUrl: './bubble-chart-widget.component.html',
  styleUrls: ['./bubble-chart-widget.component.scss'],
})
export class BubbleChartWidgetComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  bubbleChart: Chart;
  nftContent: NFTContent;
  icon: any = '../../../../assets/images/widget-icons/Bubble-chart.png';
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
    //check if the widget is already in redux store
    if (!this.service.widgetExists(this.id)) {
      this.addBubbleChartToStore();
    }
    this.store.select(selectBubbleCharts).subscribe((data) => {
      data.map((chart) => {
        if (chart.WidgetId === this.id) {
          this.bubbleChart = chart;
        }
      });
    });

    this.highlightService.selectedWidgetChange.subscribe((id) => {
      if (this.bubbleChart.WidgetId === id) {
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
    const dialogRef = this.dialog.open(ConfigureBubbleChartComponent, {
      data: {
        id: this.id,
        widget: this.bubbleChart,
      },
    });
  }

  //delete chart from redux
  public deleteWidget() {
    const dialogRef = this.dialog.open(DeleteWidgetComponent, {
      data: {
        widgetType: 'Bubble Chart',
        widgetId: this.id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.store.dispatch(deleteBubbleChart({ chart: this.bubbleChart }));
        this.onDeleteWidget.emit(this.id);
      }
    });
  }

  //add chart to redux
  private addBubbleChartToStore() {
    this.bubbleChart = {
      WidgetId: this.id,
      WidgetType: bubblechart,
      ProjectId: this.nftContent.ProjectId,
      ProjectName: this.nftContent.ProjectName,
      ChartTitle: 'Bubble Chart',
      KeyTitle: 'Name',
      ValueTitle: 'Value',
      ChartData: [],
      Color: [],
      FontColor: '#000000',
      FontSize: 12,
      Height: 295,
      Width: 295,
      Query: '',
      QuerySuccess: false,
      ChartImage: 'string',
    };

    this.clickedInsideInput = true;
    this.isEditing = true;
    this.newTitle = '';

    this.store.dispatch(addBubbleChart({ chart: this.bubbleChart }));
    this.service.updateUsedStatus(this.id);
  }

  //open batch selection popup
  public openAddData() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        userId: this.nftContent.UserId,
        widget: this.bubbleChart,
      },
    });
  }

  //update database
  public updateInDB() {
    this.composerService.updateChart(this.bubbleChart).subscribe({
      next: (res) => {},
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
      complete: () => {
        this.popupMsgService.openSnackBar('Bubble Chart updated successfully!');
        this.service.setSavedStatus(this.bubbleChart.WidgetId);
        this.dialog.closeAll();
      },
    });
  }

  //enable editing title
  public enableEditing() {
    this.clickedInsideInput = true;
    this.isEditing = true;
    this.newTitle = this.bubbleChart.ChartTitle!;
  }

  //called when user types on title input field
  public onChangeTitle(event: any) {
    if (event.target.value.length > 0) {
      this.newTitle = event.target.value;
    }
  }

  //save new ttile
  public saveTitle() {
    this.onClickInput();
    if (this.newTitle !== '') {
      this.bubbleChart = {
        ...this.bubbleChart,
        ChartTitle: this.newTitle,
      };

      if (this.service.getSavedStatus(this.bubbleChart.WidgetId)) {
        this.updateInDB();
      }

      this.store.dispatch(updateBubbleChart({ chart: this.bubbleChart }));
      this.isEditing = false;
    } else {
      this.popupMsgService.openSnackBar('Widget title can not be empty');
    }
  }

  //called when user clicks on input field
  public onClickInput() {
    this.clickedInsideInput = true;
  }

  public cancel() {
    this.isEditing = false;
    this.newTitle = this.bubbleChart.ChartTitle!;
  }

  //triggered when useer clicks on anywhere in the document
  @HostListener('document:click')
  clickedOut() {
    if (!this.clickedInsideInput) {
      this.isEditing = false;
      this.newTitle = this.bubbleChart.ChartTitle!;
    }
    this.clickedInsideInput = false;
  }
}
