import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  addTable,
  deleteProofBot,
  deleteTable,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectNFTContent,
  selectTable,
} from 'src/app/store/nft-state-store/nft.selector';
import { Table } from 'src/models/nft-content/table';
import { ConfigureTableComponent } from '../../modals/configure-table/configure-table.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  nft$: any;
  table: Table;
  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private service: DndServiceService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
    //this.image$ = this.store.select(selectNFTImages);
  }

  ngOnInit(): void {
    //check if the widget is already in the redux store
    if (!this.service.widgetExists(this.id)) {
      this.addTableToStore();
    }
  }

  private showNFT() {}

  //add table to redux store
  private addTableToStore() {
    this.table = {
      WidgetId: this.id,
      ProjectId: 'ABC',
      WidgetType: 'table',
      TableTitle: 'Table',
      TableContent: '',
    };

    this.store.dispatch(addTable({ table: this.table }));
    //this.showNFT();

    this.getTable();
    this.service.updateUsedStatus(this.id);
  }

  //delete table from redux store
  deleteWidget() {
    this.store.dispatch(deleteTable({ table: this.table }));
    this.onDeleteWidget.emit(this.id);
  }

  //open configuartion popup
  openDialog() {
    this.getTable();
    const dialogRef = this.dialog.open(ConfigureTableComponent, {
      data: {
        id: this.id,
        widget: this.table,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getTable();
    });
  }

  //get table from redux store
  private getTable() {
    this.store.select(selectTable).subscribe((data) => {
      data.map((table) => {
        if (table.WidgetId === this.id) {
          this.table = table;
        }
      });
    });
  }
}
