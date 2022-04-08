import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { timeline } from 'src/models/nft-content/widgetTypes';
import { SelectBatchComponent } from '../select-batch/select-batch.component';
import { SelectMasterDataTypeComponent } from '../select-master-data-type/select-master-data-type.component';

@Component({
  selector: 'app-widget-content',
  templateUrl: './widget-content.component.html',
  styleUrls: ['./widget-content.component.scss'],
})
export class WidgetContentComponent implements OnInit {
  id: any;
  userId: string;
  widget: any;
  timeline = timeline;
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.userId = this.data.userId;
    this.widget = this.data.widget;
  }

  //open batch selection popup
  openBatchSelection() {
    const dialogRef = this.dialog.open(SelectBatchComponent, {
      data: {
        id: this.id,
        userId: this.userId,
        widget: this.widget,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openMasterDataSelection() {
    const dialogRef = this.dialog.open(SelectMasterDataTypeComponent, {
      data: {
        id: this.id,
        userId: this.userId,
        widget: this.widget,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
