import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectMasterDataTypeComponent } from '../select-master-data-type/select-master-data-type.component';
import { WidgetContentComponent } from '../widget-content/widget-content.component';

@Component({
  selector: 'app-select-data',
  templateUrl: './select-data.component.html',
  styleUrls: ['./select-data.component.scss'],
})
export class SelectDataComponent implements OnInit {
  dataSource: any = [
    {
      field1: 'Data1',
      field2: 'Data1',
      field3: 'Data1',
      field4: 'Data1',
      field5: 'Data1',
      field6: 'Data1',
    },
    {
      field1: 'Data2',
      field2: 'Data2',
      field3: 'Data2',
      field4: 'Data2',
      field5: 'Data2',
      field6: 'Data2',
    },
    {
      field1: 'Data3',
      field2: 'Data3',
      field3: 'Data3',
      field4: 'Data3',
      field5: 'Data3',
      field6: 'Data3',
    },
  ];

  columns: string[] = [];

  id: any;
  widget: any;
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.createColumns();
  }

  openMasterDataSelection() {
    const dialogRef = this.dialog.open(SelectMasterDataTypeComponent, {
      data: {
        id: this.id,
        widget: this.widget,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
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

  createColumns() {
    Object.keys(this.dataSource[0]).map((column) => {
      this.columns.push(column);
    });
  }
}
