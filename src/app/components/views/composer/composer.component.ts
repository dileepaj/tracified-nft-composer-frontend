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

export interface Widget {
  wid: number;
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
  @ViewChild('nftcontent') myDiv: ElementRef;

  ngAfterViewInit() {}

  availableWidgets: Widget[] = [
    {
      wid: 1,
      used: false,
      name: 'Timeline',
      icon: 'event_note',
    },
    {
      wid: 2,
      used: false,
      name: 'ProofBot',
      icon: 'ondemand_video',
    },
    {
      wid: 3,
      used: false,
      name: 'Carbon Footprint',
      icon: 'filter_drama',
    },
    {
      wid: 4,
      used: false,
      name: 'NFT Image',
      icon: 'wallpaper',
    },
    {
      wid: 5,
      used: false,
      name: 'Bar Chart',
      icon: 'bar_chart',
    },
    {
      wid: 6,
      used: false,
      name: 'Pie Chart',
      icon: 'pie_chart',
    },
    {
      wid: 7,
      used: false,
      name: 'Bubble Chart',
      icon: 'bubble_chart',
    },
    {
      wid: 8,
      used: false,
      name: 'Table',
      icon: 'table_view',
    },
  ];
  usedWidgets: Widget[] = [];

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private stateService: DndServiceService
  ) {}

  ngOnInit(): void {
    this.usedWidgets = this.stateService.getWidgets();
  }

  //Called when a widget is dropped to drap and drop area.
  drop(event: CdkDragDrop<Widget[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
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
}
