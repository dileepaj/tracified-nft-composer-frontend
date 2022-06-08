import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { AppState } from 'src/app/store/app.state';
import { projectStatus } from 'src/app/store/nft-state-store/nft.actions';
import {
  selectNFTContent,
  selectProjectStatus,
} from 'src/app/store/nft-state-store/nft.selector';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { Router } from '@angular/router';

@Component({
  selector: 'app-close-project',
  templateUrl: './close-project.component.html',
  styleUrls: ['./close-project.component.scss'],
})
export class CloseProjectComponent implements OnInit {
  saving: boolean = false;
  nftContent: NFTContent;
  private user: any;
  onLogout: boolean;

  constructor(
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<CloseProjectComponent>,
    private composerService: ComposerBackendService,
    private popupMsgService: PopupMessageService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.store.select(selectNFTContent).subscribe((nft) => {
      this.nftContent = nft;
    });
    this.user = this.data.user;
    this.onLogout = this.data.logout || false;
  }

  //close close project dialog
  public cancel() {
    this.dialogRef.close();
  }

  //close project without saving
  public dontSave() {
    if (this.onLogout) {
      this.router.navigate(['/login']);
      sessionStorage.setItem('Token', '');
    } else {
      this.router.navigate(['/layout/projects/' + this.user.TenentId]);
    }
    this.dialogRef.close();
  }

  //save project before closing the project
  public save() {
    this.saving = true;
    let status = true;

    const project = {
      ProjectName: this.nftContent.ProjectName,
      ProjectId: this.nftContent.ProjectId,
      Timestamp: this.nftContent.Timestamp,
      NFTName: this.nftContent.NFTName,
      UserId: this.nftContent.UserId,
      CreatorName: this.nftContent.CreatorName,
      TenentId: this.nftContent.TenentId,
      TenentName: '',
      ContentOrderData: this.nftContent.ContentOrderData,
    };

    this.store.select(selectProjectStatus).subscribe((s) => {
      status = s;
    });

    //check whether the project is a new project or old project
    if (status === true) {
      this.composerService.saveProject(project).subscribe({
        next: (res) => {},
        error: (err) => {
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
          this.saving = false;
        },
        complete: () => {
          this.store.dispatch(projectStatus({ status: false }));
          this.saving = false;
          if (this.onLogout) {
            this.router.navigate(['/login']);
            sessionStorage.setItem('Token', '');
          } else {
            this.router.navigate(['/layout/projects/' + this.user.TenentId]);
          }

          this.dialogRef.close();
        },
      });
    } else {
      this.composerService.updateProject(project).subscribe({
        next: (res) => {},
        error: (err) => {
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
          this.saving = false;
        },
        complete: () => {
          this.store.dispatch(projectStatus({ status: false }));
          this.saving = false;
          if (this.onLogout) {
            this.router.navigate(['/login']);
            sessionStorage.setItem('Token', '');
          } else {
            this.router.navigate(['/layout/projects/' + this.user.TenentId]);
          }
          this.dialogRef.close();
        },
      });
    }
  }
}
