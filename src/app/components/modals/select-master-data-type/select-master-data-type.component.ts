import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ArtifactService } from 'src/app/services/artifact.service';
import { SelectDataComponent } from '../select-data/select-data.component';
import { WidgetContentComponent } from '../widget-content/widget-content.component';

@Component({
  selector: 'app-select-master-data-type',
  templateUrl: './select-master-data-type.component.html',
  styleUrls: ['./select-master-data-type.component.scss'],
})
export class SelectMasterDataTypeComponent implements OnInit {
  id: any;
  widget: any;
  artifacts: any = [];
  loading: boolean = false;
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectMasterDataTypeComponent>,
    private artifactService: ArtifactService
  ) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.widget = this.data.widget;
    this.artifactService.getArtifacts().subscribe((data) => {
      this.artifacts = data;
    });
  }

  public openDataSelection(artifact: any) {
    const dialogRef = this.dialog.open(SelectDataComponent, {
      data: {
        id: this.id,
        widget: this.widget,
        artifact: artifact,
      },
    });

    this.dialogRef.close();
  }

  public openWidgetContent() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        widget: this.widget,
      },
    });

    this.dialogRef.close();
  }

  public close() {
    this.dialog.closeAll();
  }
}
