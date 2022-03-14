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
  src: string = '';

  im: Image[] = [
    {
      WidgetId: '1',
      src: 'abc',
    },
    {
      WidgetId: '2',
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

  uploadImage(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log('FileUpload -> files', fileList);
      this.src = fileList[0].name;
    }
    this.updateImage();
  }

  private addImageToStore() {
    this.image = {
      WidgetId: this.id,
      src: this.src,
    };

    this.store.dispatch(addNFTImage({ image: this.image }));

    this.showNFT();
  }

  private updateImage() {
    this.image = {
      WidgetId: this.id,
      src: this.src,
    };

    this.store.dispatch(updateNFTImage({ image: this.image }));
    this.showNFT();
  }

  deleteWidget() {
    this.store.dispatch(deleteNFTImage({ image: this.image }));
    this.onDeleteWidget.emit(this.id);
  }

  triggerClick() {
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
  }
}
