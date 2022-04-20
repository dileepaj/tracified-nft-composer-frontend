import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnInit,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  copyArrayItem,
  CdkDragMove,
  transferArrayItem,
  CdkDragEnter,
} from '@angular/cdk/drag-drop';

import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { WidgetContentComponent } from '../../modals/widget-content/widget-content.component';
import { ActivatedRoute } from '@angular/router';
import {
  barchart,
  bubblechart,
  carbonFp,
  nftimage,
  piechart,
  proofbot,
  table,
  timeline,
} from 'src/models/nft-content/widgetTypes';
import { NFTContent } from 'src/models/nft-content/nft.content';
import {
  selectNFTContent,
  selectProjectStatus,
} from 'src/app/store/nft-state-store/nft.selector';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Observable } from 'rxjs';
import { NewProjectComponent } from '../../modals/new-project/new-project.component';
import { projectStatus } from 'src/app/store/nft-state-store/nft.actions';
import { SelectMasterDataTypeComponent } from '../../modals/select-master-data-type/select-master-data-type.component';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';

export interface Widget {
  type: string;
  _Id?: string;
  used: boolean;
  saved: boolean;
  batch: boolean;
  name?: string;
  icon?: string;
}

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.scss'],
})
export class ComposerComponent implements OnInit, AfterViewInit {
  nftContent: NFTContent;
  opened = true;
  sidenav: boolean = true;
  position = '';
  id: string;
  private sub: any;
  saving: boolean = false;
  generated: boolean = false;

  widgetTypes: any = {
    timeline: timeline,
    proofbot: proofbot,
    carbon: carbonFp,
    bar: barchart,
    pie: piechart,
    bubble: bubblechart,
    table: table,
    image: nftimage,
  };

  @ViewChild('nftcontent') myDiv: ElementRef;

  ngAfterViewInit() {}

  availableWidgets: Widget[] = [
    {
      type: this.widgetTypes.timeline,
      used: false,
      saved: false,
      batch: false,
      name: 'Timeline',
      icon: 'event_note',
    },
    {
      type: this.widgetTypes.proofbot,
      used: false,
      saved: false,
      batch: false,
      name: 'ProofBot',
      icon: 'ondemand_video',
    },
    /*{
      type: 'carbonfp',
      used: false,
      name: 'Carbon Footprint',
      icon: 'filter_drama',
    },*/
    {
      type: this.widgetTypes.image,
      used: false,
      saved: false,
      batch: false,
      name: 'NFT Image',
      icon: 'wallpaper',
    },
    {
      type: this.widgetTypes.bar,
      used: false,
      saved: false,
      batch: false,
      name: 'Bar Chart',
      icon: 'bar_chart',
    },
    {
      type: this.widgetTypes.pie,
      used: false,
      saved: false,
      batch: false,
      name: 'Pie Chart',
      icon: 'pie_chart',
    },
    {
      type: this.widgetTypes.bubble,
      used: false,
      saved: false,
      batch: false,
      name: 'Bubble Chart',
      icon: 'bubble_chart',
    },
    {
      type: this.widgetTypes.table,
      used: false,
      saved: false,
      batch: false,
      name: 'Table',
      icon: 'table_view',
    },
  ];
  usedWidgets: Widget[] = [];

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private stateService: DndServiceService,
    private route: ActivatedRoute,
    private composerService: ComposerBackendService,
    private sidebarService: SidenavService,
    private popupMsgService: PopupMessageService
  ) {
    //this.openAddData();
    this.sidebarService.getStatus().subscribe((val) => {
      this.sidenav = val;
    });
  }

  ngOnInit(): void {
    this.usedWidgets = this.stateService.getWidgets();
    //read the router paramter assign it to id
    this.sub = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    if (!!this.id) {
      this.loadExistingProjectdata(this.id);
    }
  }

  //load the recentproject base on nft id
  loadExistingProjectdata(id: string) {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  //Called when a widget is dropped to drap and drop area.
  public drop(event: any) {
    if (event.previousContainer === event.container) {
      if (event.container.data === this.usedWidgets) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        this.stateService.rewriteWidgetArr(this.usedWidgets);
      }
    } else {
      if (!(event.currentIndex <= this.usedWidgets.length - 1)) {
        this.usedWidgets[event.currentIndex] = {
          ...event.previousContainer.data[event.previousIndex],
          _Id: Date.now().toString(),
          used: false,
        };
      } else {
        this.rearrangeArray(
          {
            ...event.previousContainer.data[event.previousIndex],
            _Id: Date.now().toString(),
            used: false,
          },
          event.currentIndex
        );
      }
      this.stateService.rewriteWidgetArr(this.usedWidgets);
    }
  }

  //get drag position
  public dragMoved(event: any) {
    this.position = `> Position X: ${event.pointerPosition.x} - Y: ${event.pointerPosition.y}`;
  }

  public dragEntered(event: CdkDragEnter<number>) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;

    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector('.cdk-drag-placeholder');
    phContainer.removeChild(phElement!);
    phContainer.parentElement!.insertBefore(phElement!, phContainer);

    moveItemInArray(this.usedWidgets, dragIndex, dropIndex);
  }

  public noReturnPredicate() {
    return false;
  }

  //Used to rearrange usedWidgets array when a widget is dropped to the drag and drop area
  private rearrangeArray(item: any, index: any) {
    let oldItem: any;
    let i: number;
    for (i = index; i < this.usedWidgets.length; i++) {
      oldItem = this.usedWidgets[i];
      this.usedWidgets[i] = item;
      item = oldItem;
    }

    this.usedWidgets.push(item);
  }

  //delete a widget
  public deleteWidget(id: any) {
    let index: number = 0;
    this.usedWidgets.map((widget) => {
      if (widget._Id === id) {
        index = this.usedWidgets.indexOf(widget);
      }
    });
    transferArrayItem(this.usedWidgets, [], index, 0);

    this.stateService.rewriteWidgetArr(this.usedWidgets);
    this.saveOrUpdateProject(true);
  }

  public openAddData() {
    const dialogRef = this.dialog.open(SelectMasterDataTypeComponent, {
      data: {
        id: 'abc123',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }

  private getNftContent() {
    this.store.select(selectNFTContent).subscribe((data) => {
      this.nftContent = data;
    });
  }

  private downloadFile(content: any, name: string, type: string) {
    var a = document.createElement('a');
    var blob = new Blob([content], { type: type });
    a.href = window.URL.createObjectURL(blob);
    a.download = name + '.html';
    a.click();
  }

  public generateHTML() {
    this.generated = true;
    this.getNftContent();
    this.composerService.generateHTML(this.nftContent).subscribe({
      next: (data: any) => {
        this.generated = false;
        const decodedRes = atob(data.Response);
        this.downloadFile(decodedRes, this.nftContent.NFTName, 'html');
      },
      error: (err) => {
        this.generated = false;
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
    });
  }

  private saveProject() {
    this.saving = true;
    let widgetArr: any = [];
    this.getNftContent();
    this.usedWidgets.map((widget) => {
      widgetArr.push({ WidgetId: widget._Id, Type: widget.type });
    });
    const project = {
      ProjectName: this.nftContent.ProjectName,
      ProjectId: this.nftContent.ProjectId,
      Timestamp: this.nftContent.Timestamp,
      NFTName: this.nftContent.NFTName,
      UserId: this.nftContent.UserId,
      CreatorName: this.nftContent.CreatorName,
      TenentId: this.nftContent.TenentId,
      TenentName: '',
      ContentOrderData: widgetArr,
    };

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
        this.popupMsgService.openSnackBar('Project Saved!!');
        this.saving = false;
      },
    });
  }

  private updateProject() {
    this.saving = true;
    let widgetArr: any = [];
    this.getNftContent();
    this.usedWidgets.map((widget) => {
      widgetArr.push({ WidgetId: widget._Id, Type: widget.type });
    });
    const project = {
      ProjectName: this.nftContent.ProjectName,
      ProjectId: this.nftContent.ProjectId,
      Timestamp: this.nftContent.Timestamp,
      NFTName: this.nftContent.NFTName,
      UserId: this.nftContent.UserId,
      CreatorName: this.nftContent.CreatorName,
      TenentId: this.nftContent.TenentId,
      TenentName: '',
      ContentOrderData: widgetArr,
    };

    this.composerService.updateProject(project).subscribe({
      next: (res) => {},
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );

        this.saving = false;
      },
      complete: () => {
        this.popupMsgService.openSnackBar('Project Updated!!');
        this.saving = false;
      },
    });
  }

  public saveOrUpdateProject(deleteFlag: boolean) {
    let status = true;
    this.store.select(selectProjectStatus).subscribe((s) => {
      status = s;
    });

    if (status === true) {
      if (!deleteFlag) {
        this.saveProject();
      }
    } else {
      this.updateProject();
    }
  }
}
