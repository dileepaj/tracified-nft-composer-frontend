import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss'],
})
export class DeleteProjectComponent implements OnInit {
  projectId: string = '';
  projectName: string = '';

  constructor(
    private apiService: ComposerBackendService,
    private popupMsgService: PopupMessageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteProjectComponent>
  ) {}

  ngOnInit(): void {
    this.projectId = this.data.projectId;
    this.projectName = this.data.projectName;
  }

  //delete the selected project
  public deleteProject() {
    this.apiService.deleteProject(this.projectId).subscribe({
      next: (res) => {},
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later.'
        );
      },
      complete: () => {
        this.popupMsgService.openSnackBar('Project deleted!!');
        this.dialogRef.close(true);
      },
    });
  }

  //close the dialog without deleting the project
  public cancel() {
    this.dialogRef.close(false);
  }
}
