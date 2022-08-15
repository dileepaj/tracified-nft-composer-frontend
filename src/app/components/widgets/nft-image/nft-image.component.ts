import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  EventEmitter,
  Output,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { AppState } from 'src/app/store/app.state';
import {
  addNFTImage,
  deleteNFTImage,
  updateNFTImage,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectNFTContent,
  selectNFTImages,
} from 'src/app/store/nft-state-store/nft.selector';
import { Image } from 'src/models/nft-content/image';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WidgethighlightingService } from 'src/app/services/widgethighlighting.service';
import { ImagePreviewComponent } from '../../modals/image-preview/image-preview.component';
import { DeleteWidgetComponent } from '../../modals/delete-widget/delete-widget.component';

@Component({
  selector: 'app-nft-image',
  templateUrl: './nft-image.component.html',
  styleUrls: ['./nft-image.component.scss'],
})
export class NftImageComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLElement>;
  public image: Image;
  file: File;
  shortLink: string = '';
  loading: boolean = false;
  base64: string = '';
  img: any = '';
  projectId: string;
  src: string = '';
  saving: boolean = false;
  icon: any = '../../../../assets/images/widget-icons/Image-upload.png';
  public highlight = false;
  public isEditing = false;
  public newTitle: string = '';
  private clickedInsideInput = false;
  private clickedOnTitle = false;

  constructor(
    private store: Store<AppState>,
    private service: DndServiceService,
    private composerService: ComposerBackendService,
    private popupMsgService: PopupMessageService,
    public dialog: MatDialog,
    private highlightService: WidgethighlightingService
  ) {
    this.store.select(selectNFTContent).subscribe((content) => {
      this.projectId = content.ProjectId;
    });
  }

  ngOnInit(): void {
    //check if the widget is already in redux store
    if (!this.service.widgetExists(this.id)) {
      this.addImageToStore();
    }
    this.store.select(selectNFTImages).subscribe((data) => {
      data.map((img) => {
        if (img.WidgetId === this.id) {
          this.image = img;
          this.base64 = img.Base64Image;
        }
      });
    });

    this.highlightService.selectedWidgetChange.subscribe((id) => {
      if (this.image.WidgetId === id) {
        this.highlight = true;
      } else {
        this.highlight = false;
      }
    });
  }

  //called when file input change event is emitted
  public onChange(event: any) {
    this.file = event.target.files[0];
    this.uploadImage(event);
  }

  //called when user uploads an image
  public uploadImage(event: Event) {
    this.loading = !this.loading;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.file);

    this.loading = false; // Flag variable
  }

  //adds image to redux store
  private addImageToStore() {
    this.image = {
      WidgetId: this.id,
      ProjectId: this.projectId,
      Title: 'NFT Image',
      Type: '',
      Base64Image: '',
    };

    this.clickedInsideInput = true;
    this.isEditing = true;
    this.newTitle = '';

    this.store.dispatch(addNFTImage({ image: this.image }));
    this.service.updateUsedStatus(this.id);
  }

  //update redux state
  private updateImage() {
    this.image = {
      ...this.image,
      Type: this.file.type,
      Base64Image: this.base64,
    };

    this.saveImage();
    this.store.dispatch(updateNFTImage({ image: this.image }));
  }

  //delete image from redux store
  public deleteWidget() {
    const dialogRef = this.dialog.open(DeleteWidgetComponent, {
      data: {
        widgetType: 'Image',
        widgetId: this.id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.store.dispatch(deleteNFTImage({ image: this.image }));
        this.onDeleteWidget.emit(this.id);
      }
    });
  }

  //trigger file input click event
  public triggerClick() {
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
  }

  //check whether user has uploaded an image or not
  public isUploaded() {
    return this.base64 !== '';
  }

  //create base64 image
  private _handleReaderLoaded(readerEvt: any) {
    this.base64 = readerEvt.target.result;
    this.updateImage();
    this.updateHTML();
  }

  //update html
  public updateHTML() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.img = reader.result;
    };
  }

  public saveImage() {
    this.saving = true;
    this.composerService.saveImage(this.image).subscribe({
      next: (res) => {},
      error: (err) => {
        this.saving = false;
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
      complete: () => {
        this.saving = false;
        this.popupMsgService.openSnackBar('Image added successfully!');
        this.service.setSavedStatus(this.image.WidgetId);
        this.dialog.closeAll();
      },
    });
  }

  //called when user updates the image
  public onUpdateChange(event: any) {
    this.file = event.target.files[0];
    this.uploadUpdatedImage(event);
  }

  public uploadUpdatedImage(event: Event) {
    this.loading = !this.loading;
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = this._updateHadleRederLoaded.bind(this);
    reader.readAsBinaryString(this.file);
    this.loading = false;
  }

  //create base64 updated image
  private _updateHadleRederLoaded(readerEvt: any) {
    this.base64 = readerEvt.target.result;
    this.updateNewImage();
    this.updateHTML();
  }

  //update the redux state on update image
  private updateNewImage() {
    this.image = {
      ...this.image,
      Type: this.file.type,
      Base64Image: this.base64,
    };

    this.updateImageInDB();
    this.store.dispatch(updateNFTImage({ image: this.image }));
  }

  //calling the endpoint for updating the image in the project
  public updateImageInDB() {
    this.saving = true;
    this.composerService.updateImage(this.image).subscribe({
      next: (res) => {},
      error: (err) => {
        this.saving = false;
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
      complete: () => {
        this.saving = false;
        this.popupMsgService.openSnackBar('Image updated successfully!');
        this.service.setSavedStatus(this.image.WidgetId);
        this.dialog.closeAll();
      },
    });
  }

  public openImagePreview() {
    this.dialog.open(ImagePreviewComponent, {
      data: {
        image: this.base64,
      },
      autoFocus: false,
    });
  }

  //enable editing title
  public enableEditing() {
    this.clickedInsideInput = true;
    this.isEditing = true;
    this.newTitle = this.image.Title!;
  }

  //called when user types on title input field
  public onChangeTitle(event: any) {
    if (event.target.value.length > 0) {
      this.newTitle = event.target.value;
    }
  }

  //called when user edits widget title
  public onTitleChange(event: any) {
    let trimedvalue = event.target.value.replace(/[^a-zA-Z0-9 ]/gm, '');
    this.newTitle = trimedvalue;
  }

  //save new ttile
  public saveTitle() {
    this.onClickInput();
    if (this.newTitle !== '') {
      if (this.newTitle.match(/[^a-zA-Z0-9 ]/gm)) {
        this.popupMsgService.openSnackBar(
          'Please remove special characters from widget title'
        );
      } else {
        this.image = {
          ...this.image,
          Title: this.newTitle,
        };

        if (this.service.getSavedStatus(this.image.WidgetId)) {
          this.updateImageInDB();
        }

        this.store.dispatch(updateNFTImage({ image: this.image }));
        this.isEditing = false;
      }
    } else {
      this.popupMsgService.openSnackBar('Widget title can not be empty');
    }
  }

  //called when user clicks on input field
  public onClickInput() {
    this.clickedInsideInput = true;
  }

  public cancel() {
    this.isEditing = false;
    this.newTitle = this.image.Title!;
  }

  //triggered when useer clicks on anywhere in the document
  @HostListener('document:click')
  clickedOut() {
    if (!this.clickedInsideInput) {
      this.isEditing = false;
      this.newTitle = this.image.Title!;
    }
    this.clickedInsideInput = false;
  }
}
