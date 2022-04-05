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
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
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
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ComposerBackendService,
    private dndService: DndServiceService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    let user: string = sessionStorage.getItem('User') || '';
    if (user !== '') {
      this.user = JSON.parse(user);
    }
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') || '';
    });
    this.apiService.getRecentProjects(this.userId).subscribe((result) => {
      if (result) {
        this.projects = result.Response;
      }
      this.loading = false;
    });
  }

  addDragAndDropArray(widgets: any[]) {
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

  openNewProject() {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        user: this.user,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openExistingProject(id: string) {
    this.projToBeLoaded = id;
    this.apiService.openExistingProject(id).subscribe({
      next: (data) => {
        const proj = data.Response;
        console.log(proj);
        let contOrder: any[] = [];
        let barcharts: Chart[] = [];
        let piecharts: Chart[] = [];
        let bubblecharts: Chart[] = [];
        let tables: Table[] = [];
        let images: Image[] = [];
        let timeline: Timeline[] = [];
        let proofbot: ProofBot[] = [];

        proj.Project.ContentOrderData.map((widget: any) => {
          contOrder.push({ WidgetId: widget.WidgetId, Type: widget.Type });
        });

        if (proj.BarCharts) {
          proj.BarCharts.map((chart: any) => {
            let ch: Chart = chart.Chart;
            ch = {
              ...ch,
              BactchId: chart.Widget.BatchId,
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
            Timeline: [],
            ProofBotData: [],
            Stats: [],
            CarbonFootprint: [],
          },
        };
        this.store.dispatch(loadProject({ nftContent: this.loadedProject }));
        this.addDragAndDropArray(this.loadedProject.ContentOrderData);
        this.projToBeLoaded = '';
        this.router.navigate([`/layout/home/${proj.Project.ProjectId}`]);
      },
      error: (err) => {
        this.openSnackBar(
          'An unexpected error occured. Please try again later.'
        );
      },
    });
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar'],
      duration: 5 * 1000,
    });
  }
}
