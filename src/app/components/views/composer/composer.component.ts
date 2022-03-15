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
import { NftCarbonfootprintComponent } from '../../widgets/nft-carbonfootprint/nft-carbonfootprint.component';
import { ConfigureBarChartComponent } from '../../modals/configure-bar-chart/configure-bar-chart.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurePieChartComponent } from '../../modals/configure-pie-chart/configure-pie-chart.component';
import { ConfigureBubbleChartComponent } from '../../modals/configure-bubble-chart/configure-bubble-chart.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';

interface Widget {
  wid: number;
  _Id?: string;
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

  ngAfterViewInit() {
    console.log(document.getElementById('nftcontent')?.innerHTML);
  }

  availableWidgets: Widget[] = [
    {
      wid: 1,
      name: 'Timeline',
      icon: 'event_note',
    },
    {
      wid: 2,
      name: 'ProofBot',
      icon: 'ondemand_video',
    },
    {
      wid: 3,
      name: 'Carbon Footprint',
      icon: 'filter_drama',
    },
    {
      wid: 4,
      name: 'NFT Image',
      icon: 'wallpaper',
    },
    {
      wid: 5,
      name: 'Bar Chart',
      icon: 'bar_chart',
    },
    {
      wid: 6,
      name: 'Pie Chart',
      icon: 'pie_chart',
    },
    {
      wid: 7,
      name: 'Bubble Chart',
      icon: 'bubble_chart',
    },
    {
      wid: 8,
      name: 'Table',
      icon: 'table_view',
    },
  ];
  usedWidgets: Widget[] = [];

  constructor(private store: Store<AppState>, public dialog: MatDialog) {}

  ngOnInit(): void {
    //this.openBarChartDialog();
  }

  //Called when a widget is dropped to drap and drop area.
  drop(event: CdkDragDrop<Widget[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(event.container.data);
    } else {
      if (!(event.currentIndex <= this.usedWidgets.length - 1)) {
        this.usedWidgets[event.currentIndex] = {
          ...event.previousContainer.data[event.previousIndex],
          _Id: Date.now().toString(),
        };
      } else {
        this.rearrangeArray(
          {
            ...event.previousContainer.data[event.previousIndex],
            _Id: Date.now().toString(),
          },
          event.currentIndex
        );
      }

      console.log(event.container.data);
    }
  }

  dragMoved(event: any) {
    this.position = `> Position X: ${event.pointerPosition.x} - Y: ${event.pointerPosition.y}`;
    console.log(this.position);
  }

  noReturnPredicate() {
    return false;
  }

  openBarChartDialog() {
    const dialogRef = this.dialog.open(ConfigureBarChartComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
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
    console.log('widget deleted - ' + index);
  }
}
