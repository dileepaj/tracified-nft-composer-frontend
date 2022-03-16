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
  selectNFTContent,
  selectTimeline,
} from 'src/app/store/nft-state-store/nft.selector';
import { Timeline } from 'src/models/nft-content/timeline';

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

  constructor(
    private store: Store<AppState>,
    private service: DndServiceService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    //check if the widget is already in the redux store
    if (!this.service.widgetExists(this.id)) {
      this.addTimelineToStore();
    } else {
      this.getTimeline();
    }
  }

  //add timeline to redux store
  private addTimelineToStore() {
    this.timeline = {
      WidgetId: this.id,
      WidgetType: 'timeline',
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
