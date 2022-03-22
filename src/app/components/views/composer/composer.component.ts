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
  opened = true;
  position = '';
  id: string;
  private sub: any;
  @ViewChild('nftcontent') myDiv: ElementRef;

  ngAfterViewInit() {}

  availableWidgets: Widget[] = [
    {
      type: 'timeline',
      used: false,
      name: 'Timeline',
      icon: 'event_note',
    },
    {
      type: 'proofbot',
      used: false,
      name: 'ProofBot',
      icon: 'ondemand_video',
    },
    {
      type: 'carbonfp',
      used: false,
      name: 'Carbon Footprint',
      icon: 'filter_drama',
    },
    {
      type: 'nftimage',
      used: false,
      name: 'NFT Image',
      icon: 'wallpaper',
    },
    {
      type: 'barchart',
      used: false,
      name: 'Bar Chart',
      icon: 'bar_chart',
    },
    {
      type: 'piechart',
      used: false,
      name: 'Pie Chart',
      icon: 'pie_chart',
    },
    {
      type: 'bubblechart',
      used: false,
      name: 'Bubble Chart',
      icon: 'bubble_chart',
    },
    {
      type: 'table',
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
    private route: ActivatedRoute
  ) {
    //this.openAddData();
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
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.stateService.rewriteWidgetArr(this.usedWidgets);
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
}
