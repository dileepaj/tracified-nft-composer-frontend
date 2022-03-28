import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import { loadProject } from 'src/app/store/nft-state-store/nft.actions';
import { Chart } from 'src/models/nft-content/chart';
import { RecentProject } from 'src/models/nft-content/htmlGenerator';
import { Image } from 'src/models/nft-content/image';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { ProofBot } from 'src/models/nft-content/proofbot';
import { Table } from 'src/models/nft-content/table';
import { Timeline } from 'src/models/nft-content/timeline';
import { Widget } from '../composer/composer.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: RecentProject[];
  loadedProject: NFTContent;
  gridColumns = 4;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private apiService: ComposerBackendService,
    private dndService: DndServiceService
  ) {}

  ngOnInit(): void {
    this.apiService.getRecentProjects('abc123').subscribe((result) => {
      if (result) {
        this.projects = result.Response;
      }
    });
  }

  addDrapAndDropArray(widgets: any[]) {
    let warr: Widget[] = [];

    widgets.map((widget) => {
      warr.push({ _Id: widget.WidgetId, used: true, type: widget.Type });
    });

    this.dndService.rewriteWidgetArr(warr);
  }

  openNewProject() {
    this.router.navigate(['/layouts']);
  }

  openExistingProject(id: string) {
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

        console.log(this.loadedProject);

        this.store.dispatch(loadProject({ nftContent: this.loadedProject }));
        this.addDrapAndDropArray(this.loadedProject.ContentOrderData);
        this.router.navigate([`/layouts`]);
      },
      error: (err) => {
        console.log(err);
        alert('An unexpected error occured. Please try again later.');
      },
    });
  }
}
