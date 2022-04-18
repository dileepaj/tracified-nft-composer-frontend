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

  public addWidget(widget: Widget) {
    this.usedWidget$.push(widget);
  }

  public rewriteWidgetArr(arr: Widget[]) {
    this.usedWidget$ = arr;
    this.rewriteReduxArray(arr);
  }

  public widgetExists(id: any) {
    let status = false;
    this.usedWidget$.map((widget) => {
      if (widget._Id === id) {
        status = widget.used;
      }
    });
    return status;
  }

  public updateUsedStatus(id: any) {
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

  public setSavedStatus(id: string) {
    this.usedWidget$.map((widget) => {
      if (widget._Id === id) {
        widget.saved = true;
      }
    });
  }

  public getSavedStatus(id: string): boolean {
    let status = false;
    this.usedWidget$.map((widget) => {
      if (widget._Id === id) {
        status = widget.saved;
      }
    });
    return status;
  }

  public setBatchStatus(id: string) {
    this.usedWidget$.map((widget) => {
      if (widget._Id === id) {
        widget.batch = true;
      }
    });
  }

  public getBatchStatus(id: string): boolean {
    let status = false;
    this.usedWidget$.map((widget) => {
      if (widget._Id === id) {
        status = widget.batch;
      }
    });
    return status;
  }
}
