import { Injectable } from '@angular/core';
import { Widget } from '../components/views/composer/composer.component';

@Injectable({
  providedIn: 'root',
})
export class DndServiceService {
  private usedWidget$: Widget[] = [];
  constructor() {}

  getWidgets() {
    return this.usedWidget$;
  }

  addWidget(widget: Widget) {
    this.usedWidget$.push(widget);
  }

  rewriteWidgetArr(arr: Widget[]) {
    this.usedWidget$ = arr;
  }

  widgetExists(id: any) {
    let status = false;
    this.usedWidget$.map((widget) => {
      if (widget._Id === id) {
        status = widget.used;
      }
    });
    return status;
  }

  updateUsedStatus(id: any) {
    this.usedWidget$.map((widget) => {
      if (widget._Id === id) {
        widget.used = true;
      }
    });
  }
}
