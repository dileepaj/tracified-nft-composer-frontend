import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { WidgethighlightingService } from 'src/app/services/widgethighlighting.service';
import { AppState } from 'src/app/store/app.state';
import {
  addTable,
  deleteProofBot,
  deleteTable,
  updateTable,
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
import { DeleteWidgetComponent } from '../../modals/delete-widget/delete-widget.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  projectId: string;
  table: Table;
  projectName: string;
  nftContent: NFTContent;
  icon: any = '../../../../assets/images/widget-icons/Table.png';
  public highlight = false;
  public isEditing: boolean = false;
  public newTitle: string = '';
  private clickedInsideInput: boolean = false;

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private service: DndServiceService,
    private composerService: ComposerBackendService,
    private popupMsgService: PopupMessageService,
    private highlightService: WidgethighlightingService
  ) {
    this.store.select(selectNFTContent).subscribe((content) => {
      this.nftContent = content;
    });
  }

  ngOnInit(): void {
    //check if the widget is already in the redux store
    if (!this.service.widgetExists(this.id)) {
      this.addTableToStore();
    }
    this.store.select(selectTable).subscribe((data) => {
      data.map((table) => {
        if (table.WidgetId === this.id) {
          this.table = table;
        }
      });
    });

    this.highlightService.selectedWidgetChange.subscribe((id) => {
      if (this.table.WidgetId === id) {
        this.highlight = true;
      } else {
        this.highlight = false;
      }
    });
  }

  public otpAdded(): boolean {
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
      Query: '',
      QuerySuccess: false,
      TableContent: 'EMPTY',
    };

    this.clickedInsideInput = true;
    this.isEditing = true;
    this.newTitle = '';

    this.store.dispatch(addTable({ table: this.table }));
    this.service.updateUsedStatus(this.id);
  }

  //delete table from redux store
  public deleteWidget() {
    const dialogRef = this.dialog.open(DeleteWidgetComponent, {
      data: {
        widgetType: 'Table',
        widgetId: this.id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.store.dispatch(deleteTable({ table: this.table }));
        this.onDeleteWidget.emit(this.id);
      }
    });
  }

  //open configuartion popup
  public openDialog() {
    const dialogRef = this.dialog.open(ConfigureTableComponent, {
      data: {
        id: this.id,
        widget: this.table,
      },
    });
  }

  //open batch selection popup
  public openAddData() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        userId: this.nftContent.UserId,
        widget: this.table,
      },
    });
  }

  //update database
  public updateInDB() {
    this.composerService.updateTable(this.table).subscribe({
      next: (res) => {},
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
      complete: () => {
        this.popupMsgService.openSnackBar('Table updated successfully!');
        this.service.setSavedStatus(this.table.WidgetId);
        this.dialog.closeAll();
      },
    });
  }

  //enable editing title
  public enableEditing() {
    this.clickedInsideInput = true;
    this.isEditing = true;
    this.newTitle = this.table.TableTitle!;
  }

  //called when user types on title input field
  public onChangeTitle(event: any) {
    if (event.target.value.length > 0) {
      this.newTitle = event.target.value;
    }
  }

  //save new ttile
  public saveTitle() {
    this.table = {
      ...this.table,
      TableTitle: this.newTitle,
    };

    if (this.service.getSavedStatus(this.table.WidgetId)) {
      this.updateInDB();
    }

    this.store.dispatch(updateTable({ table: this.table }));
    this.isEditing = false;
  }

  //called when user clicks on input field
  public onClickInput() {
    this.clickedInsideInput = true;
  }

  public cancel() {
    this.isEditing = false;
    this.newTitle = this.table.TableTitle!;
  }

  //triggered when useer clicks on anywhere in the document
  @HostListener('document:click')
  clickedOut() {
    if (!this.clickedInsideInput) {
      this.isEditing = false;
      this.newTitle = this.table.TableTitle!;
    }
    this.clickedInsideInput = false;
  }
}
