import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  loadProject,
  setCardStatus,
  setQueryResult,
  setWidgetCount,
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
import { UserserviceService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: RecentProject[];
  filteredProjects: RecentProject[];
  loadedProject: NFTContent;
  subscription: Subscription;
  gridColumns = 4;
  user: ComposerUser;
  userId: string = '';
  loading: boolean = false;
  projLoading: boolean = false;
  projToBeDeleted: string = '';
  backgroundColorArray: string[] = [
    '#FFEBEE',
    '#F3E5F5',
    '#E3F2FD',
    '#E0F7FA',
    '#E8F5E9',
    '#FFF8E1',
    '#FBE9E7',
    '#E8EAF6',
    '#E0F2F1',
    '#FCE4EC',
  ];
  fontColorArray: string[] = [
    '#E57373',
    '#BA68C8',
    '#90CAF9',
    '#4DD0E1',
    '#81C784',
    '#FFD54F',
    '#FF8A65',
    '#7986CB',
    '#4DB6AC',
    '#F06292',
  ];
  projectColors: any = [];

  listView: boolean = false;
  gridView: boolean = true;

  searchText: string = '';

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ComposerBackendService,
    private dndService: DndServiceService,
    public dialog: MatDialog,
    private popupMsgService: PopupMessageService,
    private userServices: UserserviceService
  ) {}

  ngOnInit(): void {
    this.user = this.userServices.getCurrentUser();
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') || '';
    });
    this.getRecentProjects();
  }

  /**
   * @function getRecentProjects - get user's recent projects
   */
  public getRecentProjects() {
    this.loading = true;
    this.apiService.getRecentProjects(this.userId).subscribe((result) => {
      if (result) {
        this.projects = result.Response;
        this.filteredProjects = this.projects;
        this.generateColors();
      }
      this.loading = false;
    });
  }

  /**
   * @function generateColors - generate colors for each project.
   * These colors are used in projects view when displaying recent projects
   */
  private generateColors() {
    this.projects.map((project) => {
      let random = Math.floor(Math.random() * 3);
      this.projectColors.push({
        ProjectId: project.ProjectId,
        bgColor: this.backgroundColorArray[random],
        fontColor: this.fontColorArray[random],
      });
    });
  }

  /**
   * @function getRandomBgColor - get bg color generated for a specific project
   */
  public getBgColor(projectId: string): string {
    let color: string = '';
    for (let i = 0; i < this.projectColors.length; i++) {
      if (this.projectColors[i].ProjectId === projectId) {
        color = this.projectColors[i].bgColor;
        break;
      }
    }

    return color;
  }

  /**
   * @function getFontColor - get font color generated for a specific project
   */
  public getFontColor(projectId: string): string {
    let color: string = '';
    for (let i = 0; i < this.projectColors.length; i++) {
      if (this.projectColors[i].ProjectId === projectId) {
        color = this.projectColors[i].fontColor;
        break;
      }
    }

    return color;
  }

  /**
   * @function convertDate - convert date format
   */
  public convertDate(date: any): string {
    const stillUtc = MomentAll.utc(date).toDate();
    const local = MomentAll(date)
      .zone(new Date().getTimezoneOffset())
      .format('MMM D, YYYY');
    return local;
  }

  /**
   * @function addDragAndDropArray - add loaded widgets to drag and drop array
   */
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

  /**
   * @function openNewProject - open new project popup
   */
  public openNewProject() {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        user: this.user,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  /**
   * @function openExistingProject - open existing project.
   * all the project content should be stored in the redux stroe
   */
  public openExistingProject(id: string) {
    this.projLoading = true;
    this.apiService.openExistingProject(id).subscribe({
      next: (data) => {
        const proj = data.Response;

        //arrays to store project content temporarily
        let contOrder: any[] = [];
        let widgetsInOrderArr: any[] = [];
        let widgetsNotNull: any[] = [];
        let cardStatus: CardStatus[] = [];
        let queryResult: QueryResult[] = [];
        let barcharts: Chart[] = [];
        let piecharts: Chart[] = [];
        let bubblecharts: Chart[] = [];
        let tables: Table[] = [];
        let images: Image[] = [];
        let timeline: Timeline[] = [];
        let proofbot: ProofBot[] = [];

        //get project content order
        proj.Project.ContentOrderData.map((widget: any) => {
          contOrder.push({ WidgetId: widget.WidgetId, Type: widget.Type });
          widgetsInOrderArr.push(widget.WidgetId);
          cardStatus.push({
            WidgetId: widget.WidgetId,
            WidgetType: widget.Type,
            DataSelected: true,
          });
          queryResult.push({ WidgetId: widget.WidgetId, queryResult: '' });
        });

        //get bar charts
        if (proj.BarCharts) {
          proj.BarCharts.map((chart: any) => {
            let ch: Chart = chart.Chart;
            if (widgetsInOrderArr.includes(ch.WidgetId)) {
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
              widgetsNotNull.push(ch.WidgetId);
            }
          });
        }

        //get pie charts
        if (proj.PieCharts) {
          proj.PieCharts.map((chart: any) => {
            let ch: Chart = chart.Chart;
            if (widgetsInOrderArr.includes(ch.WidgetId)) {
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
              widgetsNotNull.push(ch.WidgetId);
            }
          });
        }

        //get buuble charts
        if (proj.BubbleCharts) {
          proj.BubbleCharts.map((chart: any) => {
            let ch: Chart = chart.Chart;
            if (widgetsInOrderArr.includes(ch.WidgetId)) {
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
              widgetsNotNull.push(ch.WidgetId);
            }
          });
        }

        //get tables
        if (proj.Tables) {
          proj.Tables.map((table: any) => {
            let tb: Table = table.Table;
            if (widgetsInOrderArr.includes(tb.WidgetId)) {
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
              widgetsNotNull.push(tb.WidgetId);
            }
          });
        }

        //get images
        if (proj.Images) {
          proj.Images.map((image: any) => {
            if (widgetsInOrderArr.includes(image.WidgetId)) {
              let img: Image = image;
              images.push(img);
              widgetsNotNull.push(img.WidgetId);
            }
          });
        }

        //get timeline
        if (proj.Timeline) {
          proj.Timeline.map((tl: any) => {
            if (widgetsInOrderArr.includes(tl.WidgetId)) {
              timeline.push(tl);
              widgetsNotNull.push(tl.WidgetId);
            }
          });
        }

        //get proofbot
        if (proj.ProofBot) {
          proj.ProofBot.map((pb: any) => {
            if (widgetsInOrderArr.includes(pb.WidgetId)) {
              proofbot.push(pb);
              widgetsNotNull.push(pb.WidgetId);
            }
          });
        }

        contOrder = contOrder.filter((widget) => {
          if (widgetsNotNull.includes(widget.WidgetId)) {
            return widget;
          }
        });

        //create project object
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

        //save project in redux store
        this.store.dispatch(loadProject({ nftContent: this.loadedProject }));
        this.store.dispatch(setCardStatus({ cardStatus: cardStatus }));
        this.store.dispatch(setQueryResult({ queryResult: queryResult }));
        this.store.dispatch(
          setWidgetCount({
            widgetCount: {
              BarCharts: barcharts.length,
              PieCharts: piecharts.length,
              BubbleCharts: bubblecharts.length,
              Tables: tables.length,
              Images: images.length,
              Timelines: timeline.length,
              ProofBots: proofbot.length,
            },
          })
        );

        this.addDragAndDropArray(this.loadedProject.ContentOrderData);

        this.projLoading = false;

        this.router.navigate([`/layout/home/${proj.Project.ProjectId}`]);
      },
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later.'
        );
        this.projLoading = false;
      },
    });
  }

  /**
   * @function deleteProject - delete an existing project
   */
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

  public showGridView() {
    this.gridView = true;
    this.listView = false;
  }

  public showListView() {
    this.listView = true;
    this.gridView = false;
  }

  public searchProject() {
    this.filteredProjects = this.projects.filter((project: any) => {
      if (this.searchText !== '') {
        if (
          project.ProjectName.trim()
            .toLowerCase()
            .includes(this.searchText.trim().toLowerCase())
        ) {
          return project;
        }
      } else {
        return project;
      }
    });
  }

  public toggleSort() {
    this.filteredProjects = this.filteredProjects.reverse();
  }
}
