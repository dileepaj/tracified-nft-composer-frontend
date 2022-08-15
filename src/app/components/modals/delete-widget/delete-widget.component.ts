import {
  Component,
  OnInit,
  Inject,
  Output,
  EventEmitter,
  AfterContentInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import {
  deleteBarChart,
  projectUnsaved,
} from 'src/app/store/nft-state-store/nft.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-delete-widget',
  templateUrl: './delete-widget.component.html',
  styleUrls: ['./delete-widget.component.scss'],
})
export class DeleteWidgetComponent implements OnInit {
  widgetType: string = '';
  widgetId: string = '';

  constructor(
    private store: Store<AppState>,
    private composerService: ComposerBackendService,
    private popupMsgService: PopupMessageService,
    private storeService: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteWidgetComponent>
  ) {}

  ngOnInit(): void {
    this.widgetType = this.data.widgetType;
    this.widgetId = this.data.widgetId;
  }

  public deleteWidget() {
    switch (this.widgetType) {
      case 'Bar Chart':
        this.composerService.deleteChart(this.widgetId).subscribe({
          next: (res) => {},
          error: (err) => {
            this.popupMsgService.openSnackBar(
              'An unexpected error occured. Please try again later'
            );
          },
          complete: () => {
            this.popupMsgService.openSnackBar('Bar chart deleted');
            this.store.dispatch(projectUnsaved());
            this.dialogRef.close(true);
          },
        });
        break;
      case 'Pie Chart':
        this.composerService.deleteChart(this.widgetId).subscribe({
          next: (res) => {},
          error: (err) => {
            this.popupMsgService.openSnackBar(
              'An unexpected error occured. Please try again later'
            );
          },
          complete: () => {
            this.popupMsgService.openSnackBar('Pie chart deleted');
            this.store.dispatch(projectUnsaved());
            this.dialogRef.close(true);
          },
        });
        break;
      case 'Bubble Chart':
        this.composerService.deleteChart(this.widgetId).subscribe({
          next: (res) => {},
          error: (err) => {
            this.popupMsgService.openSnackBar(
              'An unexpected error occured. Please try again later'
            );
          },
          complete: () => {
            this.popupMsgService.openSnackBar('Bubble chart deleted');
            this.store.dispatch(projectUnsaved());
            this.dialogRef.close(true);
          },
        });
        break;
      case 'Table':
        this.composerService.deleteTable(this.widgetId).subscribe({
          next: (res) => {},
          error: (err) => {
            this.popupMsgService.openSnackBar(
              'An unexpected error occured. Please try again later'
            );
          },
          complete: () => {
            this.popupMsgService.openSnackBar('Table deleted');
            this.store.dispatch(projectUnsaved());
            this.dialogRef.close(true);
          },
        });
        break;
      case 'Timeline':
        this.composerService.deleteTimeline(this.widgetId).subscribe({
          next: (res) => {},
          error: (err) => {
            this.popupMsgService.openSnackBar(
              'An unexpected error occured. Please try again later'
            );
          },
          complete: () => {
            this.popupMsgService.openSnackBar('Timeline deleted');
            this.store.dispatch(projectUnsaved());
            this.dialogRef.close(true);
          },
        });
        break;
      case 'Proof Bot':
        this.composerService.deleteProofbot(this.widgetId).subscribe({
          next: (res) => {},
          error: (err) => {
            this.popupMsgService.openSnackBar(
              'An unexpected error occured. Please try again later'
            );
          },
          complete: () => {
            this.popupMsgService.openSnackBar('Proof Bot deleted');
            this.store.dispatch(projectUnsaved());
            this.dialogRef.close(true);
          },
        });
        break;
      case 'Image':
        this.composerService.deleteImage(this.widgetId).subscribe({
          next: (res) => {},
          error: (err) => {
            this.popupMsgService.openSnackBar(
              'An unexpected error occured. Please try again later'
            );
          },
          complete: () => {
            this.popupMsgService.openSnackBar('Image deleted');
            this.store.dispatch(projectUnsaved());
            this.dialogRef.close(true);
          },
        });
        break;
      default:
        this.popupMsgService.openSnackBar('An unexpected error occured!');
        break;
    }
  }

  public cancel() {
    this.dialogRef.close(false);
  }
}
