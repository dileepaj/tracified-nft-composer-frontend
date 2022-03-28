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

@Component({
  selector: 'app-nft-image',
  templateUrl: './nft-image.component.html',
  styleUrls: ['./nft-image.component.scss'],
})
export class NftImageComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLElement>;

  nft$: any;
  image$: Observable<Image[]>;
  private image: Image;
  file: File;
  shortLink: string = '';
  loading: boolean = false;
  base64: string = '';
  img: any = '';
  projectId: string;

  constructor(
    private store: Store<AppState>,
    private service: DndServiceService,
    private composerService: ComposerBackendService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
    this.image$ = this.store.select(selectNFTImages);
    this.store.select(selectNFTContent).subscribe((content) => {
      this.projectId = content.ProjectId;
    });
  }

  ngOnInit(): void {
    //check if the widget is already in redux store
    if (!this.service.widgetExists(this.id)) {
      this.addImageToStore();
    } else {
      this.getImage();
    }
  }

  //display nft state
  private showNFT() {}

  //called when file input change event is emitted
  onChange(event: any) {
    this.file = event.target.files[0];
    this.uploadImage(event);
  }

  //called when user uploads an image
  uploadImage(event: Event) {
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

    //this.showNFT();

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
    this.showNFT();
  }

  //delete image from redux store
  deleteWidget() {
    this.store.dispatch(deleteNFTImage({ image: this.image }));
    this.onDeleteWidget.emit(this.id);
  }

  //trigger file input click event
  triggerClick() {
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
  }

  //check whether user has uploaded an image or not
  isUploaded() {
    return this.base64 !== '';
  }

  //create base64 image
  _handleReaderLoaded(readerEvt: any) {
    this.base64 = btoa(readerEvt.target.result);
    this.updateImage();
    this.updateHTML();
  }

  //update html
  updateHTML() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.img = reader.result;
    };
  }

  getImage() {
    this.store.select(selectNFTImages).subscribe((data) => {
      data.map((img) => {
        if (img.WidgetId === this.id) {
          this.image = img;
        }
      });
    });
  }

  saveImage() {
    console.log(this.image);
    this.composerService.saveImage(this.image).subscribe((res) => {
      console.log(res);
    });
  }
}
