import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  addTable,
  updateTable,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectNFTContent,
  selectTable,
} from 'src/app/store/nft-state-store/nft.selector';
import { Table } from 'src/models/nft-content/table';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-configure-table',
  templateUrl: './configure-table.component.html',
  styleUrls: ['./configure-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigureTableComponent implements OnInit {
  nft$: any;
  private table: Table;
  tableId: any;
  title: any;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];
  tableContent: string;
  tableHtml: string = '';

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    //this.updateChart();
    this.tableId = this.data.id;
  }

  private showChart() {
    console.log('-------------------------------------------');
    console.log('++++++++++++++++++++++++++-', this.nft$);
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tab changed');
    if (tabChangeEvent.index === 1) {
      this.getTable();
      this.generateTable();
    }
  }

  updateReduxState() {
    this.table = {
      WidgetId: this.tableId,
      TableTitle: this.title,
      TableContent: this.tableContent,
    };

    console.log(this.table);

    this.store.dispatch(updateTable({ table: this.table }));

    this.showChart();
  }

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

    console.log(tableString);

    this.tableContent = tableString;
    this.tableHtml = '<table>' + this.tableContent + '</table>';
  }
}
