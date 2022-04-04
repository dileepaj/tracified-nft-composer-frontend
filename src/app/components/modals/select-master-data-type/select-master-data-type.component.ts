import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectDataComponent } from '../select-data/select-data.component';
import { WidgetContentComponent } from '../widget-content/widget-content.component';

@Component({
  selector: 'app-select-master-data-type',
  templateUrl: './select-master-data-type.component.html',
  styleUrls: ['./select-master-data-type.component.scss'],
})
export class SelectMasterDataTypeComponent implements OnInit {
  id: any;
  widget: any;
  artifacts: any = [
    {
      name: 'Farmer',
    },
    {
      name: 'Farmer',
    },
    {
      name: 'Farmer',
    },
    {
      name: 'Farmer',
    },
    {
      name: 'Farmer',
    },
  ];
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  openDataSelection() {
    const dialogRef = this.dialog.open(SelectDataComponent, {
      data: {
        id: this.id,
        widget: this.widget,
      },
    });
  }

  openWidgetContent() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        widget: this.widget,
      },
    });
  }

  close() {
    this.dialog.closeAll();
  }
}
