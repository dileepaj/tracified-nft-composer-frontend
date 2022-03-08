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
} from '@angular/cdk/drag-drop';
import { NftCarbonfootprintComponent } from '../../widgets/nft-carbonfootprint/nft-carbonfootprint.component';
import { ConfigureBarChartComponent } from '../../modals/configure-bar-chart/configure-bar-chart.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurePieChartComponent } from '../../modals/configure-pie-chart/configure-pie-chart.component';

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

  availableWidgets: any = [
    {
      _id: 1,
      name: 'Timeline',
      icon: 'event_note',
    },
    {
      _id: 2,
      name: 'ProofBot',
      icon: 'ondemand_video',
    },
    {
      _id: 3,
      name: 'Carbon Footprint',
      icon: 'filter_drama',
    },
    {
      _id: 4,
      name: 'NFT Image',
      icon: 'wallpaper',
    },
    {
      _id: 5,
      name: 'Bar Chart',
      icon: 'bar_chart',
    },
    {
      _id: 6,
      name: 'Pie Chart',
      icon: 'pie_chart',
    },
    {
      _id: 7,
      name: 'Bubble Chart',
      icon: 'bubble_chart',
    },
  ];
  usedWidgets: any = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  isEmpty(): boolean {
    if (this.usedWidgets.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  toggleWidgetPanel() {
    this.opened = !this.opened;
  }

  dragMoved(event: any) {
    this.position = `> Position X: ${event.pointerPosition.x} - Y: ${event.pointerPosition.y}`;
    console.log(this.position);
  }

  noReturnPredicate() {
    return false;
  }

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openBarChartDialog() {
    const dialogRef = this.dialog.open(ConfigurePieChartComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
