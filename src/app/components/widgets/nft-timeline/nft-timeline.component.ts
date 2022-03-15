import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  addTimeline,
  deleteTimeline,
} from 'src/app/store/nft-state-store/nft.actions';
import { selectNFTContent } from 'src/app/store/nft-state-store/nft.selector';
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
  constructor(private store: Store<AppState>) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    this.addTimelineToStore();
  }

  private addTimelineToStore() {
    this.timeline = {
      WidgetId: this.id,
      data: this.data,
    };

    this.store.dispatch(addTimeline({ timeline: this.timeline }));

    console.log(this.nft$);
  }

  deleteWidget() {
    this.store.dispatch(deleteTimeline({ timeline: this.timeline }));
    this.onDeleteWidget.emit(this.id);
  }
}
