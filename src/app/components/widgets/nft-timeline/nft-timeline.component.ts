import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  addTimeline,
  deleteTimeline,
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
  currentTimestamp : any;
  elements : any;
  elementCount : any;
  collection: HTMLCollectionOf<Element>;

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
}

