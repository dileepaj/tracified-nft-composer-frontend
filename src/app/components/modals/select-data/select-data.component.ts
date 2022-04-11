import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { ArtifactService } from 'src/app/services/artifact.service';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
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
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private artifactService: ArtifactService,
    private composerService: ComposerBackendService,
    private dndService: DndServiceService,
    private _snackBar: MatSnackBar,
    private userService: UserserviceService
  ) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.widget = this.data.widget;
    this.user = this.userService.getCurrentUser();
    console.log(this.user);
    this.artifact = this.data.artifact;
    this.createColumns();
    this.displayFields = this.artifact.displayFields;
    this.artifactService
      .getArtifactDataById(this.artifact.id)
      .subscribe((data) => {
        this.dataSource = data;
        console.log(this.dataSource[0]);
      });
  }

  public openMasterDataSelection() {
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

  public openWidgetContent() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        widget: this.widget,
      },
    });
  }

  public close() {
    this.dialog.closeAll();
  }

  private createColumns() {
    this.artifact.fields.map((field: any) => {
      this.columns.push(field.name);
      this.keys.push(field.key);
    });
    console.log(this.keys);
  }

  public updateReduxState(source: any) {
    this.saving = true;
    this.widget = {
      ...this.widget,
      BactchId: '',
      ProductId: '',
      ProductName: '',
      ArtifactId: source.artifactMetadata.artifactDataId,
    };

    if (this.widget.WidgetType === barchart) {
      this.store.dispatch(updateBarChart({ chart: this.widget }));
    } else if (this.widget.WidgetType === piechart) {
      this.store.dispatch(updatePieChart({ chart: this.widget }));
    } else if (this.widget.WidgetType === bubblechart) {
      this.store.dispatch(updateBubbleChart({ chart: this.widget }));
    } else if (this.widget.WidgetType === proofbot) {
      this.store.dispatch(updateProofBot({ proofBot: this.widget }));
    } else if (this.widget.WidgetType === timeline) {
      this.store.dispatch(updateTimeline({ timeline: this.widget }));
    } else if (this.widget.WidgetType === carbonFp) {
      this.store.dispatch(
        updateCarbonFootprint({ carbonFootprint: this.widget })
      );
    } else if (this.widget.WidgetType === table) {
      this.store.dispatch(updateTable({ table: this.widget }));
    }

    this.store.select(selectNFTContent).subscribe((data) => {
      console.log(data);
    });

    this.saveWidget(source);
  }

  private saveWidget(source: any) {
    const widget = {
      Timestamp: new Date().toISOString(),
      ProjectId: this.widget.ProjectId,
      ProjectName: this.widget.ProjectName,
      WidgetId: this.widget.WidgetId,
      ArtifactId: source.artifactMetadata.artifactDataId,
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

    let status = this.dndService.getBatchStatus(widget.WidgetId);
    if (status === false) {
      this.composerService.saveWidget(widget).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          console.log('err', err);
          this.openSnackBar(err);
        },
        complete: () => {
          this.saving = false;
          this.openSnackBar('Saved!!');
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
          //this.openSnackBar(JSON.parse(err.error.message));
          this.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.openSnackBar('Saved!!');
          this.close();
        },
      });
    }
  }

  public openSnackBar(msg: string) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar'],
      duration: 5 * 1000,
    });
  }
}
