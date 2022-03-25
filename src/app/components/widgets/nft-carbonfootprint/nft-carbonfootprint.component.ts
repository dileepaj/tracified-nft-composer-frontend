import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  addCarbonFootprint,
  deleteCarbonFootprint,
} from 'src/app/store/nft-state-store/nft.actions';
import {
  selectCarbonFP,
  selectNFTContent,
} from 'src/app/store/nft-state-store/nft.selector';
import { CarbonFootprint } from 'src/models/nft-content/carbonFootprint';
import { carbonFp } from 'src/models/nft-content/widgetTypes';
import { WidgetContentComponent } from '../../modals/widget-content/widget-content.component';

@Component({
  selector: 'app-nft-carbonfootprint',
  templateUrl: './nft-carbonfootprint.component.html',
  styleUrls: ['./nft-carbonfootprint.component.scss'],
})
export class NftCarbonfootprintComponent implements OnInit {
  @Input() id: any;
  @Output() onDeleteWidget: EventEmitter<any> = new EventEmitter();

  nft$: any;
  private carbonFootprint: CarbonFootprint;
  data: any[] = [];

  constructor(
    private store: Store<AppState>,
    private service: DndServiceService,
    public dialog: MatDialog
  ) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    //check if the widget is already in redux store
    if (!this.service.widgetExists(this.id)) {
      this.addCarbonFootprintToStore();
    } else {
      this.getFootPrint();
    }
  }

  //add carbon footprint to redux store
  private addCarbonFootprintToStore() {
    this.carbonFootprint = {
      WidgetId: this.id,
      WidgetType: carbonFp,
      data: this.data,
    };

    this.store.dispatch(
      addCarbonFootprint({ carbonFootprint: this.carbonFootprint })
    );

    this.service.updateUsedStatus(this.id);
  }

  //delete widget
  deleteWidget() {
    this.store.dispatch(
      deleteCarbonFootprint({ carbonFootPrint: this.carbonFootprint })
    );
    this.onDeleteWidget.emit(this.id);
  }

  //open batch selection popup
  openAddData() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        widget: this.carbonFootprint,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      //
    });
  }

  getFootPrint() {
    this.store.select(selectCarbonFP).subscribe((data) => {
      data.map((fp) => {
        if (fp.WidgetId === this.id) {
          this.carbonFootprint = fp;
        }
      });
    });
  }
}
