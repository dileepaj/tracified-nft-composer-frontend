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
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  addTable,
  deleteProofBot,
  deleteTable,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectCardStatus,
  selectNFTContent,
  selectTable,
} from 'src/app/store/nft-state-store/nft.selector';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { Table } from 'src/models/nft-content/table';
import { table } from 'src/models/nft-content/widgetTypes';
import { ConfigureTableComponent } from '../../modals/configure-table/configure-table.component';
import { WidgetContentComponent } from '../../modals/widget-content/widget-content.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  nft$: any;
  projectId: string;
  table: Table;
  projectName: string;
  nftContent: NFTContent;

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private service: DndServiceService,
    private composerService: ComposerBackendService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
    this.store.select(selectNFTContent).subscribe((content) => {
      this.nftContent = content;
    });
    //this.image$ = this.store.select(selectNFTImages);
  }

  ngOnInit(): void {
    //check if the widget is already in the redux store
    if (!this.service.widgetExists(this.id)) {
      this.addTableToStore();
    } else {
      this.getTable();
    }
  }

  otpAdded(): boolean {
    let buttonState = false;
    this.store.select(selectCardStatus).subscribe((data) => {
      if (data.some((e) => e.WidgetId === this.id)) {
        buttonState = true;
      }
    });
    return buttonState;
  }

  private showNFT() {}

  //add table to redux store
  private addTableToStore() {
    this.table = {
      WidgetId: this.id,
      ProjectId: this.nftContent.ProjectId,
      ProjectName: this.nftContent.ProjectName,
      WidgetType: table,
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
    this.composerService.deleteTable(this.id).subscribe({
      next: (res) => {},
      error: (err) => {
        alert(err);
      },
      complete: () => {
        this.store.dispatch(deleteTable({ table: this.table }));
        this.onDeleteWidget.emit(this.id);
      },
    });
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
          console.log(table);
        }
      });
    });
  }

  //open batch selection popup
  openAddData() {
    this.getTable();
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        userId: this.nftContent.UserId,
        widget: this.table,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }
}
