import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { AppState } from 'src/app/store/app.state';
import { newProject } from 'src/app/store/nft-state-store/nft.actions';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { ComposerUser } from 'src/models/user';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
})
export class NewProjectComponent implements OnInit {
  projectName: string = '';
  nftName: string = '';
  user: ComposerUser;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private dndService: DndServiceService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private popupMsgService: PopupMessageService,
    private userServices: UserserviceService
  ) {}

  ngOnInit(): void {
    this.user = this.userServices.getCurrentUser();
  }

  public createProject() {
    if (this.projectName !== '' && this.nftName !== '') {
      const project: NFTContent = {
        ProjectId: Date.now().toString(),
        ProjectName: this.projectName,
        NFTName: this.nftName,
        UserId: this.user.UserID,
        TenentId: this.user.TenentId,
        Timestamp: new Date().toISOString(),
        CreatorName: '',
        ContentOrderData: [],
        NFTContent: {
          BarCharts: [],
          PieCharts: [],
          BubbleCharts: [],
          Tables: [],
          Images: [],
          Timeline: [],
          ProofBot: [],
          Stats: [],
          CarbonFootprint: [],
        },
      };
      sessionStorage.setItem('NFTCom', JSON.stringify(project));
      this.store.dispatch(newProject({ nftContent: project }));
      this.dndService.rewriteWidgetArr([]);
      this.router.navigate([`/layout/home/${project.ProjectId}`]);
      this.dialog.closeAll();
    } else {
      this.popupMsgService.openSnackBar(
        'Please give a project name and nft name'
      );
    }
  }
}
