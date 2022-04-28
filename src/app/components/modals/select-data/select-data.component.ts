import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ArtifactService } from 'src/app/services/artifact.service';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { AppState } from 'src/app/store/app.state';
import {
  addCardtStatus,
  updateBarChart,
  updateBubbleChart,
  updateCarbonFootprint,
  updatePieChart,
  updateProofBot,
  updateTable,
  updateTimeline,
} from 'src/app/store/nft-state-store/nft.actions';
import { selectNFTContent } from 'src/app/store/nft-state-store/nft.selector';
import {
  barchart,
  bubblechart,
  carbonFp,
  piechart,
  proofbot,
  table,
  timeline,
} from 'src/models/nft-content/widgetTypes';
import { SelectMasterDataTypeComponent } from '../select-master-data-type/select-master-data-type.component';
import { WidgetContentComponent } from '../widget-content/widget-content.component';

@Component({
  selector: 'app-select-data',
  templateUrl: './select-data.component.html',
  styleUrls: ['./select-data.component.scss'],
})
export class SelectDataComponent implements OnInit {
  user: any;
  dataSource: any = [];
  artifact: any;
  displayFields: string;
  keys: string[] = [];
  saving: boolean = false;
  columns: string[] = [];
  id: any;
  widget: any;
  artifactAlreadySelected: boolean = false;

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private artifactService: ArtifactService,
    private composerService: ComposerBackendService,
    private dndService: DndServiceService,
    private popupMsgService: PopupMessageService,
    private userService: UserserviceService,
    public dialogRef: MatDialogRef<SelectDataComponent>
  ) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.widget = this.data.widget;
    if (this.widget.ArtifactId !== undefined && this.widget.ArtifactId !== '') {
      this.artifactAlreadySelected = true;
    }
    this.user = this.userService.getCurrentUser();
    this.artifact = this.data.artifact;
    this.createColumns();
    this.displayFields = this.artifact.displayFields;
    this.artifactService
      .getArtifactDataById(this.artifact.id)
      .subscribe((data) => {
        this.dataSource = data;
      });
  }

  /**
   * @function openMasterDataSelection - open master data selection popup
   */
  public openMasterDataSelection() {
    const dialogRef = this.dialog.open(SelectMasterDataTypeComponent, {
      data: {
        id: this.id,
        widget: this.widget,
      },
    });

    this.dialogRef.close();
  }

  /**
   * @function openWidgetContent - open widget popup
   */
  public openWidgetContent() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        widget: this.widget,
      },
    });

    this.dialogRef.close();
  }

  /**
   * @function close - close the popup
   */
  public close() {
    this.dialog.closeAll();
  }

  /**
   * @function createColumns - create the columns
   */
  private createColumns() {
    this.artifact.fields.map((field: any) => {
      this.columns.push(field.name);
      this.keys.push(field.key);
    });
  }

  /**
   * @function updateReduxState - update the redux state
   */
  public updateReduxState() {
    this.saving = true;
    this.widget = {
      ...this.widget,
      BactchId: '',
      ProductId: '',
      ProductName: '',
      ArtifactId: this.artifact.id,
    };

    switch (this.widget.WidgetType) {
      case barchart:
        this.store.dispatch(updateBarChart({ chart: this.widget }));
        break;
      case piechart:
        this.store.dispatch(updatePieChart({ chart: this.widget }));
        break;
      case bubblechart:
        this.store.dispatch(updateBubbleChart({ chart: this.widget }));
        break;
      case carbonFp:
        this.store.dispatch(
          updateCarbonFootprint({ carbonFootprint: this.widget })
        );
        break;
      case table:
        this.store.dispatch(updateTable({ table: this.widget }));
        break;
    }

    this.saveWidget();
  }

  /**
   * @function saveWidget - save the widget in the DB
   */
  private saveWidget() {
    const widget = {
      Timestamp: new Date().toISOString(),
      ProjectId: this.widget.ProjectId,
      ProjectName: this.widget.ProjectName,
      WidgetId: this.widget.WidgetId,
      ArtifactId: this.artifact.id,
      BatchId: '',
      ProductId: '',
      ProductName: '',
      TenentId: this.user.TenentId,
      UserId: this.user.UserID,
      OTP: '',
      Query: '',
      OTPType: 'Artifact',
      WidgetType: this.widget.WidgetType,
    };

    if (this.artifactAlreadySelected === false) {
      this.composerService.saveWidget(widget).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.popupMsgService.openSnackBar('Saved!!');
          //put the Data save status to sti
          this.store.dispatch(
            addCardtStatus({
              cardStatus: {
                WidgetId: widget.WidgetId,
                WidgetType: widget.WidgetType,
                DataSelected: true,
              },
            })
          );
          this.dndService.setBatchStatus(widget.WidgetId);
          this.close();
        },
      });
    } else {
      this.composerService.updateWidget(widget).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.popupMsgService.openSnackBar('Saved!!');
          this.close();
        },
      });
    }
  }
}
