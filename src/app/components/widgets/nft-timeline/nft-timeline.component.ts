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

@Component({
  selector: 'app-nft-timeline',
  templateUrl: './nft-timeline.component.html',
  styleUrls: ['./nft-timeline.component.scss'],
})
export class NftTimelineComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();

  nft$: any;
  private timeline: Timeline;
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

  constructor(
    private store: Store<AppState>,
    private service: DndServiceService,
    public dialog: MatDialog,
    private _batchService: BatchesService,
    private composerService: ComposerBackendService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
    this.store.select(selectNFTContent).subscribe((content) => {
      this.nftContent = content;
    });
  }

  ngOnInit(): void {
    //check if the widget is already in the redux store
    if (!this.service.widgetExists(this.id)) {
      this.addTimelineToStore();
    } else {
      this.getTimeline();
    }

    //this.getTimelineFromConsumer();

    this.store.select(selectTimeline).subscribe((timelines) => {
      timelines.map((timeline) => {
        if (timeline.WidgetId === this.id) {
          if (timeline.TimelineData !== undefined) {
            this.childrenOne = timeline.TimelineData!;
            this.viewBtn = true;
          }
        }
      });
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
    this.composerService.deleteTimeline(this.id).subscribe({
      next: (res) => {},
      error: (err) => {
        alert('Error');
      },
      complete: () => {
        this.store.dispatch(deleteTimeline({ timeline: this.timeline }));
        this.onDeleteWidget.emit(this.id);
      },
    });
  }

  private getTimeline() {
    this.store.select(selectTimeline).subscribe((data) => {
      data.map((tl) => {
        if (tl.WidgetId === this.id) {
          this.timeline = tl;
        }
      });
    });
  }

  //batch selection popup
  public openAddData() {
    this.getTimeline();
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
    this.getTimeline();
    const dialogRef = this.dialog.open(TimelineViewComponent, {
      data: {
        id: this.id,
        widget: this.timeline,
        timelineData: this.childrenOne,
      },
    });
  }

  //get timeline
  private getTimelineFromConsumer() {
    this._batchService.getTimeline('SGFuYU1hdE5zcDAx').subscribe((data) => {
      this.tabs = data.tabs;
      console.log(data);
      for (let i = 0; i < this.tabs.length; i++) {
        if (data.tabs[i].title == 'Timeline') {
          this.childrenOne = data.tabs[i].children;
        }
      }
    });
  }
}
