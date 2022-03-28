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
import { selectNFTContent } from 'src/app/store/nft-state-store/nft.selector';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Observable } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

export interface Widget {
  type: string;
  _Id?: string;
  used: boolean;
  name: string;
  icon: string;
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
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

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
      name: 'Timeline',
      icon: 'event_note',
    },
    {
      type: this.widgetTypes.proofbot,
      used: false,
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
      name: 'NFT Image',
      icon: 'wallpaper',
    },
    {
      type: this.widgetTypes.bar,
      used: false,
      name: 'Bar Chart',
      icon: 'bar_chart',
    },
    {
      type: this.widgetTypes.pie,
      used: false,
      name: 'Pie Chart',
      icon: 'pie_chart',
    },
    {
      type: this.widgetTypes.bubble,
      used: false,
      name: 'Bubble Chart',
      icon: 'bubble_chart',
    },
    {
      type: this.widgetTypes.table,
      used: false,
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
    private _snackBar: MatSnackBar
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
  drop(event: CdkDragDrop<Widget[]>) {
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
  dragMoved(event: any) {
    this.position = `> Position X: ${event.pointerPosition.x} - Y: ${event.pointerPosition.y}`;
  }

  noReturnPredicate() {
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
  deleteWidget(id: any) {
    let index: number = 0;
    this.usedWidgets.map((widget) => {
      if (widget._Id === id) {
        index = this.usedWidgets.indexOf(widget);
      }
    });
    transferArrayItem(this.usedWidgets, [], index, 0);

    this.stateService.rewriteWidgetArr(this.usedWidgets);
  }

  openAddData() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
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
      console.log(this.nftContent);
    });
  }

  public downloadFile(content: any, name: string, type: string) {
    var a = document.createElement('a');
    var blob = new Blob([content], { type: type });
    a.href = window.URL.createObjectURL(blob);
    a.download = name;
    a.click();
  }

  public generateHTML() {
    this.getNftContent();
    this.composerService.generateHTML(this.nftContent).subscribe({
      next: (data: any) => {
        const decodedRes = atob(data.Response);
        this.downloadFile(decodedRes, this.nftContent.NFTName, 'html');
      },
      error: (err) => {
        console.log(err);
        alert('An unexpected error occured. Please try again later');
      },
    });
  }

  public saveProject() {
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
      CreatorName: this.nftContent.Creator,
      TenentId: this.nftContent.TenentId,
      TenentName: '',
      ContentOrderData: widgetArr,
    };

    console.log(project);

    this.composerService.saveProject(project).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        alert('An unexpected error occured. Please try again later');
        console.log(err);
        this.saving = false;
      },
      complete: () => {
        this.openSnackBar('Project Saved!!');
        this.saving = false;
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
