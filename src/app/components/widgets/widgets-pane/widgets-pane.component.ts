import { Component, OnInit, Input } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-widget-pane',
  templateUrl: './widgets-pane.component.html',
  styleUrls: ['./widgets-pane.component.scss'],
})
export class WidgetsPaneComponent implements OnInit {
  opened = true;
  @Input() widgets: any = [];

  constructor() {}

  ngOnInit(): void {}

  public toggle() {
    this.opened = !this.opened;
  }
}
