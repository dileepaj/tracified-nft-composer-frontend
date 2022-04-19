import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  loadProject,
  newProject,
  setCardStatus,
  setQueryResult,
} from 'src/app/store/nft-state-store/nft.actions';
import { Chart } from 'src/models/nft-content/chart';
import { RecentProject } from 'src/models/nft-content/htmlGenerator';
import { Image } from 'src/models/nft-content/image';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { ProofBot } from 'src/models/nft-content/proofbot';
import { Table } from 'src/models/nft-content/table';
import { Timeline } from 'src/models/nft-content/timeline';
import { NewProjectComponent } from '../../modals/new-project/new-project.component';
import { Widget } from '../composer/composer.component';
import { ComposerUser } from 'src/models/user';
import { CardStatus, QueryResult } from 'src/models/nft-content/cardStatus';

import * as MomentAll from 'moment';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: RecentProject[];
  loadedProject: NFTContent;
  subscription: Subscription;
  gridColumns = 4;
  user: ComposerUser;
  userId: string = '';
  loading: boolean = false;
  projToBeLoaded: string = '';
  projToBeDeleted: string = '';

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ComposerBackendService,
    private dndService: DndServiceService,
    public dialog: MatDialog,
    private popupMsgService: PopupMessageService
  ) {}

  ngOnInit(): void {
    let user: string = sessionStorage.getItem('User') || '';
    if (user !== '') {
      this.user = JSON.parse(user);
    }
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') || '';
    });
    this.getRecentProjects();
  }

  public getRecentProjects() {
    this.loading = true;
    this.apiService.getRecentProjects(this.userId).subscribe((result) => {
      if (result) {
        this.projects = result.Response;
      }
      this.loading = false;
    });
  }

  public convertDate(date: any): string {
    const stillUtc = MomentAll.utc(date).toDate();
    const local = MomentAll(date)
      .zone(new Date().getTimezoneOffset())
      .format('MMM D, YYYY');
    return local;
  }

  private addDragAndDropArray(widgets: any[]) {
    let warr: Widget[] = [];
    widgets.map((widget) => {
      warr.push({
        _Id: widget.WidgetId,
        used: true,
        saved: true,
        batch: true,
        type: widget.Type,
      });
    });

    this.dndService.rewriteWidgetArr(warr);
  }

  public openNewProject() {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        user: this.user,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openExistingProject(id: string) {
    this.projToBeLoaded = id;
    this.apiService.openExistingProject(id).subscribe({
      next: (data) => {
        const proj = data.Response;
        let contOrder: any[] = [];
        let cardStatus: CardStatus[] = [];
        let queryResult: QueryResult[] = [];
        let barcharts: Chart[] = [];
        let piecharts: Chart[] = [];
        let bubblecharts: Chart[] = [];
        let tables: Table[] = [];
        let images: Image[] = [];
        let timeline: Timeline[] = [];
        let proofbot: ProofBot[] = [];

        proj.Project.ContentOrderData.map((widget: any) => {
          contOrder.push({ WidgetId: widget.WidgetId, Type: widget.Type });
          cardStatus.push({
            WidgetId: widget.WidgetId,
            WidgetType: widget.Type,
            DataSelected: true,
          });
          queryResult.push({ WidgetId: widget.WidgetId, queryResult: '' });
        });

        if (proj.BarCharts) {
          proj.BarCharts.map((chart: any) => {
            let ch: Chart = chart.Chart;
            ch = {
              ...ch,
              BactchId: chart.Widget.BatchId,
              ArtifactId: chart.Widget.ArtifactId,
              ProductName: chart.Widget.productName,
              TenentId: chart.Widget.TenentiD,
              UserId: chart.Widget.UserId,
              OTPType: chart.Widget.OTPType,
              OTP: chart.Widget.OTP,
              Query: chart.Widget.Query,
              WidgetType: chart.Widget.WidgetType,
            };
            barcharts.push(ch);
          });
        }

        if (proj.PieCharts) {
          proj.PieCharts.map((chart: any) => {
            let ch: Chart = chart.Chart;
            ch = {
              ...ch,
              BactchId: chart.Widget.BatchId,
              ArtifactId: chart.Widget.ArtifactId,
              ProductName: chart.Widget.productName,
              TenentId: chart.Widget.TenentiD,
              UserId: chart.Widget.UserId,
              OTPType: chart.Widget.OTPType,
              OTP: chart.Widget.OTP,
              Query: chart.Widget.Query,
              WidgetType: chart.Widget.WidgetType,
            };
            piecharts.push(ch);
          });
        }
        if (proj.BubbleCharts) {
          proj.BubbleCharts.map((chart: any) => {
            let ch: Chart = chart.Chart;
            ch = {
              ...ch,
              BactchId: chart.Widget.BatchId,
              ArtifactId: chart.Widget.ArtifactId,
              ProductName: chart.Widget.productName,
              TenentId: chart.Widget.TenentiD,
              UserId: chart.Widget.UserId,
              OTPType: chart.Widget.OTPType,
              OTP: chart.Widget.OTP,
              Query: chart.Widget.Query,
              WidgetType: chart.Widget.WidgetType,
            };
            bubblecharts.push(ch);
          });
        }

        if (proj.Tables) {
          proj.Tables.map((table: any) => {
            let tb: Table = table.Table;
            tb = {
              ...tb,
              BactchId: table.Widget.BatchId,
              ArtifactId: table.Widget.ArtifactId,
              ProductName: table.Widget.productName,
              TenentId: table.Widget.TenentiD,
              UserId: table.Widget.UserId,
              OTPType: table.Widget.OTPType,
              OTP: table.Widget.OTP,
              Query: table.Widget.Query,
              WidgetType: table.Widget.WidgetType,
            };
            tables.push(tb);
          });
        }

        if (proj.Images) {
          proj.Images.map((image: any) => {
            let img: Image = image;
            images.push(img);
          });
        }

        if (proj.Timeline) {
          proj.Timeline.map((tl: any) => {
            timeline.push(tl);
          });
        }

        if (proj.ProofBot) {
          proj.ProofBot.map((pb: any) => {
            proofbot.push(pb);
          });
        }

        this.loadedProject = {
          ProjectId: proj.Project.ProjectId,
          ProjectName: proj.Project.ProjectName,
          NFTName: proj.Project.NFTName,
          UserId: proj.Project.UserId,
          TenentId: proj.Project.TenentId,
          Timestamp: proj.Project.Timestamp,
          CreatorName: proj.Project.CreatorName,
          ContentOrderData: contOrder,
          NFTContent: {
            BarCharts: barcharts,
            PieCharts: piecharts,
            BubbleCharts: bubblecharts,
            Tables: tables,
            Images: images,
            Timeline: timeline,
            ProofBot: proofbot,
            Stats: [],
            CarbonFootprint: [],
          },
        };

        this.store.dispatch(loadProject({ nftContent: this.loadedProject }));
        this.store.dispatch(setCardStatus({ cardStatus: cardStatus }));
        this.store.dispatch(setQueryResult({ queryResult: queryResult }));

        this.addDragAndDropArray(this.loadedProject.ContentOrderData);

        this.projToBeLoaded = '';

        this.router.navigate([`/layout/home/${proj.Project.ProjectId}`]);
      },
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later.'
        );
        this.projToBeLoaded = '';
      },
    });
  }

  public deleteProject(projectId: string) {
    this.projToBeDeleted = projectId;

    this.apiService.deleteProject(projectId).subscribe({
      next: (res) => {},
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later.'
        );
        this.projToBeDeleted = '';
      },
      complete: () => {
        this.projToBeDeleted = '';
        this.getRecentProjects();
        this.popupMsgService.openSnackBar('Project deleted!!');
      },
    });
  }
}
