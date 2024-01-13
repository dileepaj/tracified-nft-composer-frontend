import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CardStatus, QueryResult } from 'src/models/nft-content/cardStatus';
import { Chart } from 'src/models/nft-content/chart';
import { Table } from 'src/models/nft-content/table';
import { AppState } from '../store/app.state';
import { ComposerBackendService } from './composer-backend.service';
import { Image } from 'src/models/nft-content/image';
import { Timeline } from 'src/models/nft-content/timeline';
import { ProofBot } from 'src/models/nft-content/proofbot';
import {
  loadProject,
  newProject,
  resetStore,
  setCardStatus,
  setQueryResult,
  setWidgetCount,
} from '../store/nft-state-store/nft.actions';
import { Widget } from '../components/views/composer/composer.component';
import { Router } from '@angular/router';
import { DndServiceService } from './dnd-service.service';
import { PopupMessageService } from './popup-message/popup-message.service';
import { NFTContent } from 'src/models/nft-content/nft.content';

@Injectable({
  providedIn: 'root',
})
export class ProjectLoaderService {
  private loadedProject: NFTContent;

  constructor(
    private composerService: ComposerBackendService,
    private store: Store<AppState>,
    private router: Router,
    private dndService: DndServiceService,
    private popupMsgService: PopupMessageService
  ) {}

  public loadExistingProject(projectId: string, _callback?: any) {
    this.composerService.openExistingProject(projectId).subscribe({
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
                QuerySuccess: true,
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
                QuerySuccess: true,
                WidgetType: chart.Widget.WidgetType,
              };
              piecharts.push(ch);
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
                QuerySuccess: true,
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
          Description: proj.Project.Description,
          UserId: proj.Project.UserId,
          TenentId: proj.Project.TenentId,
          Timestamp: proj.Project.Timestamp,
          CreatorName: proj.Project.CreatorName,
          ContentOrderData: contOrder,
          NFTContent: {
            BarCharts: barcharts,
            PieCharts: piecharts,
            Tables: tables,
            Images: images,
            Timeline: timeline,
            ProofBot: proofbot,
            Stats: [],
            CarbonFootprint: [],
          },
          DownloadRequest: false
        };

        //save project in redux store
        this.store.dispatch(resetStore());
        this.store.dispatch(loadProject({ nftContent: this.loadedProject }));
        this.store.dispatch(setCardStatus({ cardStatus: cardStatus }));
        this.store.dispatch(setQueryResult({ queryResult: queryResult }));
        this.store.dispatch(
          setWidgetCount({
            widgetCount: {
              BarCharts: barcharts.length,
              PieCharts: piecharts.length,
              Tables: tables.length,
              Images: images.length,
              Timelines: timeline.length,
              ProofBots: proofbot.length,
            },
          })
        );

        this.addDragAndDropArray(this.loadedProject.ContentOrderData);

        sessionStorage.setItem('composerProjectId', proj.Project.ProjectId);

        _callback(proj.Project.ProjectId);
      },
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later.'
        );
        _callback();
      },
    });
  }

  public loadNewProject(_callback?: any) {
    let nftContent = JSON.parse(sessionStorage.getItem('NFTCom') || '');
    if (nftContent !== '') {
      this.store.dispatch(newProject({ nftContent }));
      _callback(true);
    } else {
      _callback(false);
    }
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
}
