import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  addTimeline,
  deleteTimeline,
  updateTimeline,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectCarbonFP,
  selectCardStatus,
  selectNFTContent,
  selectTimeline,
} from 'src/app/store/nft-state-store/nft.selector';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { Timeline, TimelineData } from 'src/models/nft-content/timeline';
import { timeline } from 'src/models/nft-content/widgetTypes';
import { TimelineViewComponent } from '../../modals/timeline-view/timeline-view.component';
import { WidgetContentComponent } from '../../modals/widget-content/widget-content.component';
import { BatchesService } from 'src/app/services/batches.service';
import { TracibilityProfileWithTimeline } from 'src/app/entity/timeline';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { WidgethighlightingService } from 'src/app/services/widgethighlighting.service';
import { DeleteWidgetComponent } from '../../modals/delete-widget/delete-widget.component';
import * as MomentAll from 'moment';

@Component({
  selector: 'app-nft-timeline',
  templateUrl: './nft-timeline.component.html',
  styleUrls: ['./nft-timeline.component.scss'],
})
export class NftTimelineComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();

  public timeline: Timeline;
  data: TimelineData[];
  projectId: string;
  nftContent: NFTContent;
  tabs: any[];
  childrenOne: any[] = [];
  childrenTwo: any[] = [];
  title: any;
  key: any;
  value: any;
  viewBtn: boolean = false;
  icon: any = '../../../../assets/images/widget-icons/timeline.png';
  public highlight = false;
  currentTimestamp: any;
  elements: any;
  elementCount: any;
  collection: HTMLCollectionOf<Element>;
  public isEditing: boolean = false;
  public newTitle: string = '';
  private clickedInsideInput: boolean = false;
  public inputId: string = '';

  constructor(
    private store: Store<AppState>,
    private service: DndServiceService,
    public dialog: MatDialog,
    private _batchService: BatchesService,
    private composerService: ComposerBackendService,
    private popupMsgService: PopupMessageService,
    private highlightService: WidgethighlightingService
  ) {
    this.store.select(selectNFTContent).subscribe((content) => {
      this.nftContent = content;
    });
  }

  ngOnInit(): void {
    //check if the widget is already in the redux store
    if (!this.service.widgetExists(this.id)) {
      this.addTimelineToStore();
    }
    this.store.select(selectTimeline).subscribe((timelines) => {
      timelines.map((timeline) => {
        if (timeline.WidgetId === this.id) {
          this.timeline = timeline;
          if (timeline.TimelineData !== undefined) {
            this.childrenOne = timeline.TimelineData!;
            this.viewBtn = true;
          }
        }
      });
    });
    this.highlightService.selectedWidgetChange.subscribe((id) => {
      if (this.timeline.WidgetId === id) {
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

  //add timeline to redux store
  private addTimelineToStore() {
    this.timeline = {
      WidgetId: this.id,
      WidgetType: timeline,
      ProjectId: this.nftContent.ProjectId,
      TimelineData: this.data,
    };

    this.clickedInsideInput = true;
    this.isEditing = true;
    this.newTitle = '';
    this.inputId = `timeline-${this.id}`;

    this.store.dispatch(addTimeline({ timeline: this.timeline }));
    this.service.updateUsedStatus(this.id);
  }

  //delete timeline widget
  public deleteWidget() {
    const dialogRef = this.dialog.open(DeleteWidgetComponent, {
      data: {
        widgetType: 'Timeline',
        widgetId: this.id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.store.dispatch(deleteTimeline({ timeline: this.timeline }));
        this.onDeleteWidget.emit(this.id);
      }
    });
  }

  //batch selection popup
  public openAddData() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        userId: this.nftContent.UserId,
        widget: this.timeline,
      },
      autoFocus: false,
    });
  }

  //open the view timeline popup
  public openDialog() {
    const dialogRef = this.dialog.open(TimelineViewComponent, {
      data: {
        id: this.id,
        widget: this.timeline,
        timelineData: this.childrenOne,
      },
      autoFocus: false,
    });
  }

  /**
   * @function convertDate - convert the date format
   * @param date
   */
  public convertDate(date: any): string {
    const stillUtc = MomentAll.utc(date).toDate();
    // MomentAll(date).zone((new Date()).getTimezoneOffset()).format('YYYY-MM-DD hh:mm A')
    const local = MomentAll(date)
      .zone(new Date().getTimezoneOffset())
      .format('YYYY-MM-DD hh:mm A');
    // MomentAll(stillUtc).local().format('LLLL');
    return local;
  }

  //update database
  public updateInDB() {
    this.composerService.updateTimeline(this.timeline).subscribe({
      next: (res) => {},
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
      complete: () => {
        this.popupMsgService.openSnackBar('Timeline updated successfully!');
        this.service.setSavedStatus(this.timeline.WidgetId);
        this.dialog.closeAll();
      },
    });
  }

  //enable editing title
  public enableEditing() {
    this.clickedInsideInput = true;
    this.isEditing = true;
    this.newTitle = this.timeline.Title!;
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
      if (this.newTitle.match(/[^a-zA-Z0-9 ]/gm)) {
        this.popupMsgService.openSnackBar(
          'Please remove special characters from widget title'
        );
      } else {
        this.timeline = {
          ...this.timeline,
          Title: this.newTitle,
        };

        if (this.service.getSavedStatus(this.timeline.WidgetId)) {
          this.updateInDB();
        }

        this.store.dispatch(updateTimeline({ timeline: this.timeline }));
        this.isEditing = false;
      }
    } else {
      this.popupMsgService.openSnackBar('Widget title can not be empty');
    }
  }

  public cancel() {
    this.isEditing = false;
    this.newTitle = this.timeline.Title!;
  }

  //called when user clicks on input field
  public onClickInput() {
    this.clickedInsideInput = true;
  }

  //triggered when useer clicks on anywhere in the document
  @HostListener('document:click')
  clickedOut() {
    if (!this.clickedInsideInput) {
      this.isEditing = false;
      this.newTitle = this.timeline.Title!;
    }
    this.clickedInsideInput = false;
  }
}
