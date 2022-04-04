import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Widget } from '../components/views/composer/composer.component';
import { AppState } from '../store/app.state';
import { setWidgetOrder } from '../store/nft-state-store/nft.actions';
import {
  selectNFTContent,
  selectWidgetOrder,
} from '../store/nft-state-store/nft.selector';

@Injectable({
  providedIn: 'root',
})
export class DndServiceService {
  private usedWidget$: Widget[] = [];
  constructor(private store: Store<AppState>) {}

  getWidgets() {
    return this.usedWidget$;
  }

  addWidget(widget: Widget) {
    this.usedWidget$.push(widget);
  }

  rewriteWidgetArr(arr: Widget[]) {
    this.usedWidget$ = arr;
    this.rewriteReduxArray(arr);
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

  private rewriteReduxArray(widgets: any) {
    let warr: any = [];

    widgets.map((w: Widget) => {
      let widget = {
        WidgetId: w._Id,
        Type: w.type,
      };

      warr.push(widget);
    });

    this.store.dispatch(setWidgetOrder({ widgetOrder: warr }));
  }

  setSavedStatus(id: string) {
    this.usedWidget$.map((widget) => {
      if (widget._Id === id) {
        widget.saved = true;
      }
    });
  }

  getSavedStatus(id: string): boolean {
    let status = false;
    this.usedWidget$.map((widget) => {
      if (widget._Id === id) {
        status = widget.saved;
      }
    });
    return status;
  }

  setBatchStatus(id: string) {
    this.usedWidget$.map((widget) => {
      if (widget._Id === id) {
        widget.batch = true;
      }
    });
  }

  getBatchStatus(id: string): boolean {
    let status = false;
    this.usedWidget$.map((widget) => {
      if (widget._Id === id) {
        status = widget.batch;
      }
    });
    return status;
  }
}
