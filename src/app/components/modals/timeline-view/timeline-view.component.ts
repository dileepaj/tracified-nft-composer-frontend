import { Component, OnInit } from '@angular/core';
import { BatchesService } from 'src/app/services/batches.service';

@Component({
  selector: 'app-timeline-view',
  templateUrl: './timeline-view.component.html',
  styleUrls: ['./timeline-view.component.scss'],
})
export class TimelineViewComponent implements OnInit {
  tabs: any[];
  childrenOne: any[];
  title: any;
  key: any;
  value: any;

  constructor(private _batchService: BatchesService) {}

  ngOnInit(): void {
    this.getTimelineFromConsumer();
  }

  //get timeline
  getTimelineFromConsumer() {
    this._batchService.getTimeline().subscribe((data) => {
      this.tabs = data.tabs;
      for (let i = 0; i < this.tabs.length; i++) {
        if (data.tabs[i].title == 'Timeline') {
          this.childrenOne = data.tabs[i].children;
        }
      }
    });
  }
}
