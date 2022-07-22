import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  addQueryResult,
  addTable,
  deleteQueryResult,
  projectUnsaved,
  updateTable,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectNFTContent,
  selectProjectStatus,
  selectQueryResult,
  selectTable,
} from 'src/app/store/nft-state-store/nft.selector';
import { Table } from 'src/models/nft-content/table';
import { ViewEncapsulation } from '@angular/core';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';

import { Data } from '@angular/router';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';

@Component({
  selector: 'app-configure-table',
  templateUrl: './configure-table.component.html',
  styleUrls: ['./configure-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigureTableComponent implements OnInit {
  nft$: any;
  tabIndex: number = 0;
  newProj: boolean;
  table: Table;
  tableId: any;
  title: any;
  query: string = '';
  displayedColumns: string[] = [];
  dataSource = [];
  tableContent: string = '';
  tableHtml: string = '';
  queryExecuted: boolean = false;
  saving: boolean = false;
  querySuccess: boolean = false;
  prevResults: string = '';

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private composerService: ComposerBackendService,
    private dndService: DndServiceService,
    private popupMsgService: PopupMessageService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
    this.store.select(selectProjectStatus).subscribe((status) => {
      this.newProj = status;
    });
  }

  ngOnInit(): void {
    this.tableId = this.data.id;
    this.table = this.data.widget;
    this.query = this.table.Query!;
    if (this.table.QuerySuccess) {
      this.querySuccess = true;
    }
    this.assignValues();
  }

  private showChart() {}

  /**
   * @function CheckQuerySavingStatus - check , executed query save or not  use this function for show the congigure button
   */
  public CheckQuerySavingStatus(): boolean {
    let buttonState = false;
    if (this.queryExecuted) {
      if (this.querySuccess) {
        this.store.select(selectQueryResult).subscribe((data) => {
          if (data.some((e) => e.WidgetId === this.data.id)) {
            buttonState = true;
          }
        });
      }
    } else {
      this.store.select(selectQueryResult).subscribe((data) => {
        if (data.some((e) => e.WidgetId === this.data.id)) {
          buttonState = true;
        }
      });
    }

    return buttonState;
  }

  /**
   * @function setValueToTable - set values to the table from redux
   */
  private setValueToTable() {
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

  /**
   * @function tabChanged - called when user moves to a different tab
   * @param tabChangeEvent
   */
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1) {
      this.assignValues();
      this.setValueToTable();
      this.generateTable();
    }
  }

  /**
   * @function updateReduxState - update redux state
   */
  public updateReduxState() {
    this.saving = true;
    if (!this.queryExecuted) {
      this.table = {
        ...this.table,
        TableTitle: this.title,
        Query: this.query,
        QuerySuccess: true,
      };
    } else {
      if (this.querySuccess) {
        this.table = {
          ...this.table,
          TableTitle: this.title,
          Query: this.query,
          TableContent: this.tableContent,
          QuerySuccess: true,
        };
      } else {
        this.store.dispatch(
          deleteQueryResult({
            queryResult: { WidgetId: this.data.id, queryResult: '' },
          })
        );

        this.table = {
          ...this.table,
          TableTitle: 'Table',
          Query: this.query,
          TableContent: 'EMPTY',
          QuerySuccess: false,
        };
      }
    }

    this.saveTable(this.table);
    this.store.dispatch(updateTable({ table: this.table }));

    this.showChart();
  }

  /**
   * @function getTable - get table from redux
   */
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

  /**
   * @function assignValues - assign table title and content
   */
  private assignValues() {
    this.title = this.table.TableTitle;
    this.tableContent = this.table.TableContent!;
  }

  /**
   * @function generateTable - generate table HTML
   */
  private generateTable() {
    if (this.dataSource.length > 0) {
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
    }

    this.tableHtml = '<table>' + this.tableContent + '</table>';
  }

  /**
   * @function saveTable - save the table on DB
   * @param table
   */
  private saveTable(table: Table) {
    let status = this.dndService.getSavedStatus(table.WidgetId);
    if (status === false) {
      this.composerService.saveTable(table).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.popupMsgService.openSnackBar('Table saved successfully!');
          this.dndService.setSavedStatus(table.WidgetId);
          this.store.dispatch(projectUnsaved());
          this.dialog.closeAll();
        },
      });
    } else {
      this.composerService.updateTable(table).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.popupMsgService.openSnackBar('Table updated successfully!');
          this.store.dispatch(projectUnsaved());
          this.dialog.closeAll();
        },
      });
    }
  }

  /**
   * @function onQueryResult - Query success event
   * @param event
   */
  public onQueryResult(event: any) {
    this.query = event.query;
    this.queryExecuted = true;
    this.prevResults = event.prevResults;
    if (event.success) {
      this.tabIndex = 1;
      this.querySuccess = true;
    } else {
      this.querySuccess = false;
    }
  }

  /**
   * @function onCancel - on cancel close the dialog
   */
  public onCancel() {
    if (this.table.Query === undefined || this.table.Query === '') {
      this.store.dispatch(
        deleteQueryResult({
          queryResult: { WidgetId: this.table.WidgetId, queryResult: '' },
        })
      );
      this.dialog.closeAll();
    } else {
      if (this.querySuccess && !this.table.QuerySuccess) {
        this.store.dispatch(
          deleteQueryResult({
            queryResult: { WidgetId: this.table.WidgetId, queryResult: '' },
          })
        );
      } else if (this.querySuccess && this.table.QuerySuccess) {
        this.store.dispatch(
          addQueryResult({
            queryResult: {
              WidgetId: this.table.WidgetId,
              queryResult: this.prevResults,
            },
          })
        );
      }
      this.dialog.closeAll();
    }
  }
}
