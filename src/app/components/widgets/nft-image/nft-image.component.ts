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

@Component({
  selector: 'app-nft-image',
  templateUrl: './nft-image.component.html',
  styleUrls: ['./nft-image.component.scss'],
})
export class NftImageComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLElement>;
  private image: Image;
  file: File;
  shortLink: string = '';
  loading: boolean = false;
  base64: string = '';
  img: any = '';
  projectId: string;
  src: string = '';
  saving: boolean = false;
  icon: any = '../../../../assets/images/widget-icons/Image-upload.png';

  constructor(
    private store: Store<AppState>,
    private service: DndServiceService,
    private composerService: ComposerBackendService,
    private popupMsgService: PopupMessageService,
    public dialog: MatDialog
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
    this.composerService.deleteImage(this.id).subscribe({
      next: (res) => {},
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
      complete: () => {
        this.store.dispatch(deleteNFTImage({ image: this.image }));
        this.onDeleteWidget.emit(this.id);
      },
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
        this.popupMsgService.openSnackBar('Image saved');
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
        this.popupMsgService.openSnackBar('Image updated');
        this.service.setSavedStatus(this.image.WidgetId);
        this.dialog.closeAll();
      },
    });
  }
}
