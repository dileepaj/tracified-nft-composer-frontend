import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  addTable,
  updateTable,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectNFTContent,
  selectQueryResult,
  selectTable,
} from 'src/app/store/nft-state-store/nft.selector';
import { Table } from 'src/models/nft-content/table';
import { ViewEncapsulation } from '@angular/core';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Data } from '@angular/router';

@Component({
  selector: 'app-configure-table',
  templateUrl: './configure-table.component.html',
  styleUrls: ['./configure-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigureTableComponent implements OnInit {
  nft$: any;
  table: Table;
  tableId: any;
  title: any;
  query: string = '';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = [
    { position: 1, name: 'Hydrogen', weight: 1.0079 },
    { position: 2, name: 'Helium', weight: 4.0026 },
    { position: 3, name: 'Lithium', weight: 6.941 },
    { position: 4, name: 'Beryllium', weight: 9.0122 },
  ];
  tableContent: string;
  tableHtml: string = '';

  saving: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private composerService: ComposerBackendService,
    private dndService: DndServiceService,
    private _snackBar: MatSnackBar
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    //this.updateChart();
    this.tableId = this.data.id;
    this.table = this.data.widget;
    this.setValueToTable();
  }

  private showChart() {}

  //check , executed query save or not  use this function for show the congigure button
  CheckQuerySavingStatus(): boolean {
    let buttonState = false;
    this.store.select(selectQueryResult).subscribe((data) => {
      if (data.some((e) => e.WidgetId === this.data.id)) {
        buttonState = true;
      }
    });
    return buttonState;
  }

  setValueToTable() {
    this.store.select(selectQueryResult).subscribe((data) => {
      let tableData = data.find((v) => v.WidgetId === this.data.id);
      if (
        !!tableData &&
        tableData != undefined &&
        tableData.queryResult != ''
      ) {
        let tableobject = JSON.stringify(tableData.queryResult);
        let dta = eval(tableobject);
        let a = JSON.parse(dta);

        this.dataSource = a.val.MainTable;
      }
    });
  }

  //called when user moves to a different tab
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1) {
      //this.getTable();
      this.assignValues();
      this.generateTable();
    }
  }

  //update redux state
  updateReduxState() {
    /*this.table = {
      WidgetId: this.tableId,
      WidgetType: 'table',
      TableTitle: this.title,
      Query: this.query,
      TableContent: this.tableContent,
    };*/

    this.saving = true;
    this.table = {
      ...this.table,
      TableTitle: this.title,
      Query: this.query,
      TableContent: this.tableContent,
    };

    this.saveTable(this.table);
    this.store.dispatch(updateTable({ table: this.table }));

    this.showChart();
  }

  //get table from redux
  private getTable() {
    this.store.select(selectTable).subscribe((data) => {
      data.map((table) => {
        if (table.WidgetId === this.tableId) {
          this.title = table.TableTitle;
          this.tableContent = table.TableContent!;
        }
      });
    });
  }

  private assignValues() {
    this.title = this.table.TableTitle;
    this.tableContent = this.table.TableContent!;
  }

  //generate table html
  private generateTable() {
    let tableString = '<thead><tr>';
    Object.keys(this.dataSource[0]).map((column) => {
      tableString += '<th>' + column + '</th>';
    });

    tableString += '</tr></thead><tbody>';

    this.dataSource.map((data) => {
      tableString += '<tr>';
      Object.entries(data).map((d) => {
        tableString += '<td>' + d[1] + '</td>';
      });
      tableString += '</tr>';
    });

    tableString += '</tbody>';

    this.tableContent = tableString;
    this.tableHtml = '<table>' + this.tableContent + '</table>';
  }

  private saveTable(table: Table) {
    console.log('table', table);
    let status = this.dndService.getSavedStatus(table.WidgetId);
    if (status === false) {
      this.composerService.saveTable(table).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          console.log(err);
          this.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.openSnackBar('Saved!!');
          this.dndService.setSavedStatus(table.WidgetId);
          this.dialog.closeAll();
        },
      });
    } else {
      this.composerService.updateTable(table).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          console.log(err);
          this.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.openSnackBar('Saved!!');
          this.dialog.closeAll();
        },
      });
    }
  }

  public addQuery(event: any) {
    console.log(event);
    this.query = event;
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar'],
      duration: 5 * 1000,
    });
  }
}
