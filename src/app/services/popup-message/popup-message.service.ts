import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PopupMessageService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  private msgQueue: string[] = [];
  constructor(private _snackBar: MatSnackBar) {}

  public openSnackBar(msg: string) {
    this.msgQueue.push(msg);
    if (this.msgQueue.length === 1) {
      this.showSnackBar();
    }
  }

  private showSnackBar() {
    const ref = this._snackBar.open(this.msgQueue[0], 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar'],
      duration: 3000,
    });

    ref.afterDismissed().subscribe(() => {
      this.msgQueue.splice(0, 1);
      if (this.msgQueue.length > 0) {
        this.showSnackBar();
      }
    });
  }
}
