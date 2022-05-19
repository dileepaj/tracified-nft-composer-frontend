import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements OnInit {
  image: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteProjectComponent>
  ) {}

  ngOnInit(): void {
    this.image = this.data.image;
  }

  //close the popup
  public cancel() {
    this.dialogRef.close();
  }
}
