import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  addCarbonFootprint,
  deleteCarbonFootprint,
} from 'src/app/store/nft-state-store/nft.actions';
import { selectNFTContent } from 'src/app/store/nft-state-store/nft.selector';
import { CarbonFootprint } from 'src/models/nft-content/carbonFootprint';

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

  constructor(private store: Store<AppState>) {
    this.nft$ = this.store.select(selectNFTContent);
  }

  ngOnInit(): void {
    this.addCarbonFootprintToStore();
  }

  private addCarbonFootprintToStore() {
    this.carbonFootprint = {
      carbonFootPrintId: this.id,
      data: this.data,
    };

    this.store.dispatch(
      addCarbonFootprint({ carbonFootprint: this.carbonFootprint })
    );

    console.log(this.nft$);
  }

  deleteWidget() {
    this.store.dispatch(
      deleteCarbonFootprint({ carbonFootPrint: this.carbonFootprint })
    );
    this.onDeleteWidget.emit(this.id);
  }
}
