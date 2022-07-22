import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { WidgethighlightingService } from 'src/app/services/widgethighlighting.service';
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
import { ProofBot, ProofData, ProofURL } from 'src/models/nft-content/proofbot';
import { proofbot } from 'src/models/nft-content/widgetTypes';
import { ProofbotViewComponent } from '../../modals/proofbot-view/proofbot-view.component';
import { WidgetContentComponent } from '../../modals/widget-content/widget-content.component';
import { DeleteWidgetComponent } from '../../modals/delete-widget/delete-widget.component';

@Component({
  selector: 'app-nft-proofbot',
  templateUrl: './nft-proofbot.component.html',
  styleUrls: ['./nft-proofbot.component.scss'],
})
export class NftProofbotComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();
  proofbot: ProofBot;
  otpAdded: boolean = false;
  projectId: string;
  icon: any = '../../../../assets/images/widget-icons/Proofbot.png';
  public highlight = false;

  constructor(
    private store: Store<AppState>,
    private service: DndServiceService,
    private composerService: ComposerBackendService,
    public dialog: MatDialog,
    private popupMsgService: PopupMessageService,
    private highlightService: WidgethighlightingService
  ) {
    this.store.select(selectNFTContent).subscribe((nft) => {
      this.projectId = nft.ProjectId;
    });
  }

  ngOnInit(): void {
    //check if the widget is already in redux store
    if (!this.service.widgetExists(this.id)) {
      this.addProofbotToStore();
    }

    this.store.select(selectProofBot).subscribe((proofbots) => {
      proofbots.map((widget) => {
        if (widget.WidgetId == this.id) {
          this.proofbot = widget;
          if (widget.Data!.length > 0) {
            this.otpAdded = true;
          }
        }
      });
    });

    this.highlightService.selectedWidgetChange.subscribe((id) => {
      if (this.proofbot.WidgetId === id) {
        this.highlight = true;
      } else {
        this.highlight = false;
      }
    });
  }

  //add proofbot bot to redux store
  private addProofbotToStore() {
    this.proofbot = {
      ProjectId: this.projectId,
      WidgetId: this.id,
      WidgetType: proofbot,
      Title: 'Proofbot',
      Data: [],
    };

    this.store.dispatch(addProofBot({ proofBot: this.proofbot }));
    this.service.updateUsedStatus(this.id);
  }

  //delete proofbot from redux
  public deleteWidget() {
    const dialogRef = this.dialog.open(DeleteWidgetComponent, {
      data: {
        widgetType: 'Proofbot',
        widgetId: this.id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.store.dispatch(deleteProofBot({ proofBot: this.proofbot }));
        this.onDeleteWidget.emit(this.id);
      }
    });
  }

  public openAddData() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        widget: this.proofbot,
      },
    });
  }

  public openProofBotView() {
    const dialogRef = this.dialog.open(ProofbotViewComponent, {
      data: {
        id: this.id,
        proofbot: this.proofbot,
      },
    });
  }

  public CamelcaseToWord(string: string) {
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
  }

  //called when user clicks on a proof link
  public openProofLink(url: string) {
    window.open(url, '_blank');
  }
}
