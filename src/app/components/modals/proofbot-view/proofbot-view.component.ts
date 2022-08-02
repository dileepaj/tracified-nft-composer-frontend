import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { AppState } from 'src/app/store/app.state';
import { updateProofBot } from 'src/app/store/nft-state-store/nft.actions';
import { ProofBot, ProofData, ProofURL } from 'src/models/nft-content/proofbot';

@Component({
  selector: 'app-proofbot-view',
  templateUrl: './proofbot-view.component.html',
  styleUrls: ['./proofbot-view.component.scss'],
})
export class ProofbotViewComponent implements OnInit {
  proofbot: ProofBot;
  saving: boolean = false;

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProofbotViewComponent>,
    private composerService: ComposerBackendService,
    private popupService: PopupMessageService
  ) {}

  ngOnInit(): void {
    this.proofbot = this.data.proofbot;
  }

  //called when user clicks on a proof link
  public openProofLink(url: string) {
    window.open(url, '_blank');
  }

  /*
    removes a specific proof data section from proof bot widget
  */
  public removeProofData(proofData: ProofData) {
    let data: any = [];
    this.proofbot.Data!.map((d) => {
      if (d.TxnHash !== proofData.TxnHash) {
        data.push(d);
      }
    });

    if (data.length === 0) {
      this.popupService.openSnackBar(
        'Proof Bot widget must contain atleast one proof'
      );
    } else {
      this.proofbot = {
        ...this.proofbot,
        Data: data,
      };
    }
  }

  /*
    removes a specific proof url from proof bot widget
  */
  public removeProofLink(proofData: ProofData, proofUrl: ProofURL) {
    let urls: ProofURL[] = [];
    let availableProofs: string[] = [];
    let data: any = [];

    proofData.Urls.map((url) => {
      if (url.Type !== proofUrl.Type) {
        urls.push(url);
      }
    });

    proofData.AvailableProofs.map((proof) => {
      if (proof !== proofUrl.Type) {
        availableProofs.push(proof);
      }
    });

    proofData = {
      ...proofData,
      Urls: urls,
      AvailableProofs: availableProofs,
    };

    this.proofbot.Data!.map((pbItem) => {
      if (pbItem.TxnHash === proofData.TxnHash) {
        if (proofData.Urls.length > 0) {
          data.push(proofData);
        }
      } else {
        data.push(pbItem);
      }
    });

    if (data.length === 0) {
      this.popupService.openSnackBar(
        'Proof Bot widget must contain atleast one proof'
      );
    } else {
      this.proofbot = {
        ...this.proofbot,
        Data: data,
      };
    }
  }

  //saves proofbot data in redux store
  public save() {
    this.saving = true;
    this.composerService.updateProofbot(this.proofbot).subscribe({
      next: (res) => {
        this.store.dispatch(updateProofBot({ proofBot: this.proofbot }));
      },
      error: (err) => {
        this.saving = false;
        this.popupService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
      complete: () => {
        this.saving = false;
        this.popupService.openSnackBar('Proof Bot updated successfully!');
        this.dialogRef.close();
      },
    });
  }
}
