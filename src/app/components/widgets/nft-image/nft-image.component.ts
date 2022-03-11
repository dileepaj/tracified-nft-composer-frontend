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
  nft$: any;
  image$: Observable<Image[]>;
  private image: Image;
  src: string = '';

  im: Image[] = [
    {
      imageId: '1',
      src: 'abc',
    },
    {
      imageId: '2',
      src: 'abc',
    },
  ];
  constructor(private store: Store<AppState>) {
    this.nft$ = this.store.select(selectNFTContent);
    this.image$ = this.store.select(selectNFTImages);
  }

  ngOnInit(): void {
    this.addImageToStore();
  }

  private showNFT() {
    console.log('-------------------------------------------');
    console.log('++++++++++++++++++++++++++-', this.nft$);
  }

  uploadImage() {
    this.src = 'image.png';
    this.updateImage();
  }

  private addImageToStore() {
    this.image = {
      imageId: this.id,
      src: this.src,
    };

    this.store.dispatch(addNFTImage({ image: this.image }));

    this.showNFT();
  }

  private updateImage() {
    this.image = {
      imageId: this.id,
      src: this.src,
    };

    this.store.dispatch(updateNFTImage({ image: this.image }));
    this.showNFT();
  }

  deleteWidget() {
    this.store.dispatch(deleteNFTImage({ image: this.image }));
    this.onDeleteWidget.emit(this.id);
  }
}
