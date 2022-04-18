import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(
    private _batchService: BatchesService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.childrenOne = this.data.timelineData;
  }
}
