import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnInit,
  HostListener,
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
import { ActivatedRoute, Router } from '@angular/router';
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
  selectProjectSavedState,
  selectProjectStatus,
} from 'src/app/store/nft-state-store/nft.selector';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Observable } from 'rxjs';
import { NewProjectComponent } from '../../modals/new-project/new-project.component';
import {
  projectSaved,
  projectStatus,
  projectUnsaved,
} from 'src/app/store/nft-state-store/nft.actions';
import { SelectMasterDataTypeComponent } from '../../modals/select-master-data-type/select-master-data-type.component';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { WidgethighlightingService } from 'src/app/services/widgethighlighting.service';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { ComposerUser } from 'src/models/user';
import { MatDrawerMode } from '@angular/material/sidenav';

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
  htmlGenerated: boolean = false;
  svgGenerated: boolean = false;
  projectSaved: boolean;
  user: ComposerUser;
  projLoading: boolean = false;
  newProj: boolean;
  isClicked: boolean = false;
  sideNavMode: MatDrawerMode = 'side';
  title = 'project_name';
  projId: string='';
  nft$: Observable<NFTContent>;

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
      name: 'Proof Bot',
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
    private popupMsgService: PopupMessageService,
    private highlightService: WidgethighlightingService,
    private router: Router,
    private projectLoader: ProjectLoaderService,
    private userService: UserserviceService
  ) {
    //this.openAddData();
    this.sidebarService.getStatus().subscribe((val) => {
      this.sidenav = val;
    });
    const subscription = this.store
      .select(selectNFTContent)
      .subscribe((nft) => {
        this.title = nft.ProjectName;
        this.projId = nft.ProjectId;
      });
  }

  ngOnInit(): void {
    this.store.select(selectProjectStatus).subscribe((status) => {
      this.newProj = status;
      
    });

    this.checkRefreshed();

    this.usedWidgets = this.stateService.getWidgets();

    this.user = this.userService.getCurrentUser();
    //read the router paramter assign it to id
    this.sub = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    if (!!this.id) {
      this.loadExistingProjectdata(this.id);
    }

    //subscribe to widget highlighting service
    this.highlightService.selectedWidgetChange.subscribe((val) => {
      if (val !== '') {
        //scroll to the highlithed widget
        this.scrollToElement(val);
      }
    });

    this.store.select(selectProjectSavedState).subscribe((status) => {
      this.projectSaved = status;
    });

    if (window.innerWidth < 960) {
      this.sidebarService.close();
      this.sideNavMode = 'over';
      this.opened = false;
      this.isClicked = true;
    } else {
      this.sidebarService.open();
      this.sideNavMode = 'side';
      this.opened = true;
      this.isClicked = false;
    }
  }

  private checkRefreshed() {
    //check whether page was refreshed or not
    if (parseInt(sessionStorage.getItem('composerRefreshed') || '0') === 1) {
      const projectId = sessionStorage.getItem('composerProjectId') || '';
      const newProject = sessionStorage.getItem('composerNewProject') || '1';
      if (projectId !== '') {
        this.projLoading = true;
        if (parseInt(newProject) === 1) {
          this.projectLoader.loadNewProject((success: boolean) => {
            if (success) {
              this.usedWidgets = this.stateService.getWidgets();
              sessionStorage.setItem('composerRefreshed', '0');
              this.projLoading = false;
            } else {
              this.router.navigate(['/layout/projects/' + this.user.TenentId]);
              sessionStorage.setItem('composerRefreshed', '0');
              this.projLoading = false;
            }
          });
        } else {
          this.projectLoader.loadExistingProject(projectId, () => {
            this.usedWidgets = this.stateService.getWidgets();
            sessionStorage.setItem('composerRefreshed', '0');
            this.projLoading = false;
          });
        }
      } else {
        this.router.navigate(['/layout/projects/' + this.user.TenentId]);
      }
    }
  }

  //load the recentproject base on nft id
  loadExistingProjectdata(id: string) {}

  //listen to page refresh event
  @HostListener('window:beforeunload', ['$event']) openConfirmation(e: any) {
    e.preventDefault();
    sessionStorage.setItem('composerRefreshed', '1');
    sessionStorage.setItem('composerNewProject', this.newProj ? '1' : '0');
    if (!this.projectSaved) {
      e.returnValue = 'Changes may not be saved.';
    }
    return e;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    sessionStorage.setItem('composerRefreshed', '0');
  }

  /**
   * @function drop - Called when a widget is dropped to drap and drop area.
   * @param event
   */
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
      this.store.dispatch(projectUnsaved());
    }
  }

  public scrollToElement(id: string) {
    const element = document.getElementById(id)!;
    element.scrollIntoView();
  }

  public noReturnPredicate() {
    return false;
  }

  /**
   * @function rearrangeArray - Used to rearrange usedWidgets array when a widget is dropped to the drag and drop area
   * @param item, index
   */
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

  /**
   * @function deleteWidget - delete a widget
   * @param id
   */
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

  /**
   * @function openAddData - open master data type popup
   */
  public openAddData() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: 'abc123',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }

  /**
   * @function getNftContent - get NFT contents from redux
   */
  private getNftContent() {
    this.store.select(selectNFTContent).subscribe((data) => {
      this.nftContent = data;
    });
  }

  /**
   * @function downloadFile - download HTML file
   * @param content, name, type
   */
  private downloadFile(content: any, name: string, type: string) {
    var a = document.createElement('a');
    var blob = new Blob([content], { type: type });
    a.href = window.URL.createObjectURL(blob);
    a.download = name + `.${type}`;
    a.click();
  }

  /**
   * @function generateHTML - get the generated HTML from the backend
   */
  public generateHTML() {
    this.htmlGenerated = true;
    this.getNftContent();
    this.composerService.generateHTML(this.nftContent).subscribe({
      next: (data: any) => {
        this.htmlGenerated = false;
        const decodedRes = this.b64DecodeUnicode(data.Response);
        this.downloadFile(decodedRes, this.nftContent.NFTName, 'html');
      },
      error: (err) => {
        this.htmlGenerated = false;
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
    });
  }

  /**
   * @function generateSVG - get the generated SVG from the backend
   */
  public generateSVG() {
    this.svgGenerated = true;
    this.getNftContent();
    this.composerService.generateSVG(this.nftContent).subscribe({
      next: (data: any) => {
        this.svgGenerated = false;
        const decodedRes = this.b64DecodeUnicode(data.Response);
        this.downloadFile(decodedRes, this.nftContent.NFTName, 'svg');
      },
      error: (err) => {
        this.svgGenerated = false;
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
    });
  }

  /**
   * @function saveProject - save project in the DB
   */
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
      Description: this.nftContent.Description,
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
        this.popupMsgService.openSnackBar('Project saved successfully!');
        this.store.dispatch(projectSaved());
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
      Description: this.nftContent.Description,
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
        this.popupMsgService.openSnackBar('Project updated successfully!');
        this.store.dispatch(projectSaved());
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

  private b64DecodeUnicode(str: string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }

  executeOpposite() {
    if (this.isClicked == true) {
      this.isClicked = false;
    } else {
      this.isClicked = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 960) {
      this.opened = false;
      this.sideNavMode = 'over';
      this.isClicked = true;
      this.sidebarService.close();
    } else {
      this.opened = true;
      this.sideNavMode = 'side';
      this.isClicked = false;
      this.sidebarService.open();
    }
  }

  
}
