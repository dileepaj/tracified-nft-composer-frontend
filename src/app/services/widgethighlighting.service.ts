import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WidgethighlightingService {
  id: string;

  selectedWidgetChange: Subject<string> = new Subject<string>();

  timer: any;

  constructor() {
    this.selectedWidgetChange.subscribe((value) => {
      this.id = value;
    });
  }

  //called when user clicks on a widget in layout panel
  public selectWidget(id: string) {
    //set widget id
    this.selectedWidgetChange.next(id);

    clearTimeout(this.timer);

    this.resetId();
  }

  private resetId() {
    //reset id value after 5 seconds
    this.timer = setTimeout(() => {
      this.selectedWidgetChange.next('');
    }, 5000);
  }
}
