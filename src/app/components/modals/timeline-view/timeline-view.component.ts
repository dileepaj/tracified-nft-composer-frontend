import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BatchesService } from 'src/app/services/batches.service';
import * as MomentAll from 'moment';
import { Timeline } from 'src/models/nft-content/timeline';

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
  timeline: Timeline;
  tdpData: any[];stageIcon = "https://s3.ap-south-1.amazonaws.com/tracified-image-storage/mobile/stage-icons/Harvesting+stage.png"


  constructor(
    private _batchService: BatchesService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.childrenOne = this.data.timelineData;
    this.tdpData = this.data.timeLineTDPData;
    this.timeline = this.data.widget;
    console.log('first', this.data.timelineTDPData)
    
    console.log('first', this.data)
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
