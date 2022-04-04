import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  addProofBot,
  deleteProofBot,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectCardStatus,
  selectNFTContent,
  selectProofBot,
  selectTimeline,
} from 'src/app/store/nft-state-store/nft.selector';
import { ProofBot } from 'src/models/nft-content/proofbot';
import { proofbot } from 'src/models/nft-content/widgetTypes';

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
  otpAdded: boolean = false;

  constructor(
    private store: Store<AppState>,
    private service: DndServiceService,
    private composerService: ComposerBackendService
  ) {
    this.nft$ = this.store.select(selectNFTContent);
    //this.image$ = this.store.select(selectNFTImages);
  }

  ngOnInit(): void {
    //checke OTP added or not
    this.store.select(selectCardStatus).subscribe((data) => {
      if (data.some((e) => e.WidgetId === this.id)) {
        this.otpAdded = true;
      }
    });
    //check if the widget is already in redux store
    if (!this.service.widgetExists(this.id)) {
      this.addProofbotToStore();
    } else {
      this.getProofBot();
    }
  }

  private showNFT() {}

  //add proofbot bot to redux store
  private addProofbotToStore() {
    this.proofbot = {
      WidgetId: this.id,
      WidgetType: proofbot,
      Title: 'Proofbot',
      Proofurls: [
        {
          Type: 'POC',
          Url: 'blablabla',
        },
      ],
    };

    this.store.dispatch(addProofBot({ proofBot: this.proofbot }));
    //this.showNFT();
    this.service.updateUsedStatus(this.id);
  }

  private updateProofbot() {
    this.showNFT();
  }

  //delete proofbot from redux
  deleteWidget() {
    this.composerService.deleteProofbot(this.id).subscribe({
      next: (res) => {},
      error: (err) => {
        alert(err);
      },
      complete: () => {
        this.store.dispatch(deleteProofBot({ proofBot: this.proofbot }));
        this.onDeleteWidget.emit(this.id);
      },
    });
  }

  getProofBot() {
    this.store.select(selectProofBot).subscribe((data) => {
      data.map((proofBot) => {
        if (proofBot.WidgetId === this.id) {
          this.proofbot = proofBot;
        }
      });
    });
  }
}
