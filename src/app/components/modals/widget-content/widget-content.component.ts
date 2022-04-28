import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { proofbot, timeline } from 'src/models/nft-content/widgetTypes';
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
  showMasterDataSelection: boolean = true;
  masterDataIcon = '../../../../assets/images/Master-data.png';
  batchSelectionIcon = '../../../../assets/images/Batch-selection.png';
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WidgetContentComponent>
  ) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.userId = this.data.userId;
    this.widget = this.data.widget;
    if (
      this.widget.WidgetType === timeline ||
      this.widget.WidgetType === proofbot
    ) {
      this.showMasterDataSelection = false;
    } else {
      this.showMasterDataSelection = true;
    }
  }

  /**
   * @function openBatchSelection - open batch selection popup
   */
  public openBatchSelection() {
    const dialogRef = this.dialog.open(SelectBatchComponent, {
      data: {
        id: this.id,
        userId: this.userId,
        widget: this.widget,
      },
    });

    this.dialogRef.close();

    dialogRef.afterClosed().subscribe((result) => {});
  }

  /**
   * @function openMasterDataSelection - open artifact selection popup
   */
  public openMasterDataSelection() {
    const dialogRef = this.dialog.open(SelectMasterDataTypeComponent, {
      data: {
        id: this.id,
        userId: this.userId,
        widget: this.widget,
      },
    });

    this.dialogRef.close();
  }
}
