import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { Timeline } from 'src/models/nft-content/timeline';
import { timeline } from 'src/models/nft-content/widgetTypes';

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
  data: any[];
  projectId: string;

  constructor(
    private store: Store<AppState>,
    private service: DndServiceService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
    this.store.select(selectNFTContent).subscribe((content) => {
      this.projectId = content.ProjectId;
    });
  }

  ngOnInit(): void {
    //check if the widget is already in the redux store
    if (!this.service.widgetExists(this.id)) {
      this.addTimelineToStore();
    } else {
      this.getTimeline();
    }
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

  //add timeline to redux store
  private addTimelineToStore() {
    this.timeline = {
      WidgetId: this.id,
      WidgetType: timeline,
      ProjectId: this.projectId,
      data: this.data,
    };

    this.store.dispatch(addTimeline({ timeline: this.timeline }));
    this.service.updateUsedStatus(this.id);
  }

  //delete timeline widget
  deleteWidget() {
    this.store.dispatch(deleteTimeline({ timeline: this.timeline }));
    this.onDeleteWidget.emit(this.id);
  }

  getTimeline() {
    this.store.select(selectTimeline).subscribe((data) => {
      data.map((tl) => {
        if (tl.WidgetId === this.id) {
          this.timeline = tl;
        }
      });
    });
  }
}
