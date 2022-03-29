import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  loadProject,
  newProject,
} from 'src/app/store/nft-state-store/nft.actions';
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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.user = this.data.user;
  }

  createProject() {
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
          ProofBotData: [],
          Stats: [],
          CarbonFootprint: [],
        },
      };

      console.log(project);

      this.store.dispatch(newProject({ nftContent: project }));
      this.dndService.rewriteWidgetArr([]);
      this.router.navigate([`/layouts/project/${project.ProjectId}`]);
      this.dialog.closeAll();
    } else {
      alert('Please give a project name and nft name');
    }
  }
}
