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
  constructor(private store: Store<AppState>, public dialog: MatDialog) {
    this.nft$ = this.store.select(selectNFTContent);
    //this.image$ = this.store.select(selectNFTImages);
  }

  ngOnInit(): void {
    this.addTableToStore();
  }

  private showNFT() {
    console.log('-------------------------------------------');
    console.log('++++++++++++++++++++++++++-', this.nft$);
  }

  private addTableToStore() {
    this.table = {
      WidgetId: this.id,
      TableTitle: 'Table',
      TableContent: '',
    };

    this.store.dispatch(addTable({ table: this.table }));
    this.showNFT();

    this.getTable();
  }

  private updateProofbot() {
    this.showNFT();
  }

  deleteWidget() {
    this.store.dispatch(deleteTable({ table: this.table }));
    this.onDeleteWidget.emit(this.id);
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfigureTableComponent, {
      data: {
        id: this.id,
      },
    });

    console.log('dbl click widget - ' + this.id);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getTable();
    });
  }

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
