import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectBatchComponent } from '../select-batch/select-batch.component';

@Component({
  selector: 'app-widget-content',
  templateUrl: './widget-content.component.html',
  styleUrls: ['./widget-content.component.scss'],
})
export class WidgetContentComponent implements OnInit {
  id: any;
  widget: any;
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.widget = this.data.widget;
  }

  //open batch selection popup
  openBatchSelection() {
    const dialogRef = this.dialog.open(SelectBatchComponent, {
      data: {
        id: this.id,
        widget: this.widget,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
