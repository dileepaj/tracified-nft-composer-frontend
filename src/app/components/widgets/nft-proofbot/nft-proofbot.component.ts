import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import {
  addProofBot,
  deleteProofBot,
} from 'src/app/store/nft-state-store/nft.actions';
import { selectNFTContent } from 'src/app/store/nft-state-store/nft.selector';
import { ProofBot } from 'src/models/nft-content/proofbot';

@Component({
  selector: 'app-nft-proofbot',
  templateUrl: './nft-proofbot.component.html',
  styleUrls: ['./nft-proofbot.component.scss'],
})
export class NftProofbotComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  nft$: any;
  image$: Observable<ProofBot[]>;
  private proofbot: ProofBot;
  data: any[] = [];
  constructor(private store: Store<AppState>) {
    this.nft$ = this.store.select(selectNFTContent);
    //this.image$ = this.store.select(selectNFTImages);
  }

  ngOnInit(): void {
    this.addProofbotToStore();
  }

  private showNFT() {
    console.log('-------------------------------------------');
    console.log('++++++++++++++++++++++++++-', this.nft$);
  }

  private addProofbotToStore() {
    this.proofbot = {
      proofBotId: this.id,
      Title: 'Proofbot',
      Proofurls: [
        {
          Type: 'POC',
          Url: 'blablabla',
        },
      ],
    };

    this.store.dispatch(addProofBot({ proofBot: this.proofbot }));
    this.showNFT();
  }

  private updateProofbot() {
    this.showNFT();
  }

  deleteWidget() {
    this.store.dispatch(deleteProofBot({ proofBot: this.proofbot }));
    this.onDeleteWidget.emit(this.id);
  }
}
