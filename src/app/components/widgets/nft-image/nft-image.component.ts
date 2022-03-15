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

  constructor(private store: Store<AppState>) {
    this.nft$ = this.store.select(selectNFTContent);
    this.image$ = this.store.select(selectNFTImages);
  }

  ngOnInit(): void {
    this.addImageToStore();
  }

  //display nft state
  private showNFT() {
    console.log('-------------------------------------------');
    console.log('++++++++++++++++++++++++++-', this.nft$);
  }

  //called when file input change event is emitted
  onChange(event: any) {
    this.file = event.target.files[0];
    this.uploadImage(event);
  }

  //called when user uploads an image
  uploadImage(event: Event) {
    this.loading = !this.loading;
    console.log(this.file);

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
      Title: 'NFT Image',
      Type: 'image/jpeg',
      Base64Image: '',
    };

    this.store.dispatch(addNFTImage({ image: this.image }));

    this.showNFT();
  }

  //update redux state
  private updateImage() {
    this.image = {
      WidgetId: this.id,
      Type: this.file.type,
      Base64Image: this.base64,
    };

    this.store.dispatch(updateNFTImage({ image: this.image }));
    this.showNFT();
  }

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
}
