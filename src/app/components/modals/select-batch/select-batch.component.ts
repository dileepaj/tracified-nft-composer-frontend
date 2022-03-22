import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { BatchesService } from 'src/app/services/batches.service';
import { AppState } from 'src/app/store/app.state';
import {
  updateBarChart,
  updateBubbleChart,
  updateCarbonFootprint,
  updatePieChart,
  updateProofBot,
  updateTable,
  updateTimeline,
} from 'src/app/store/nft-state-store/nft.actions';
import { WidgetContentComponent } from '../widget-content/widget-content.component';

@Component({
  selector: 'app-select-batch',
  templateUrl: './select-batch.component.html',
  styleUrls: ['./select-batch.component.scss'],
})
export class SelectBatchComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  id: any;
  widget: any;
  chart: any;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  ];
  productColumns: string[] = ['productName', 'stages'];
  batchColumns: string[] = [
    'batchId',
    'createdDate',
    'dateLastEntry',
    'currentStage',
    'createdBy',
    'images',
  ];
  tdpColumns: string[] = ['stage', 'stageName', 'tdp'];
  products: any = [
    {
      productName: 'Product 1',
      stages: ['Stage', 'Stage', 'Stage', 'Stage', 'Stage'],
    },
    {
      productName: 'Product 2',
      stages: ['Stage', 'Stage', 'Stage', 'Stage', 'Stage'],
    },
    {
      productName: 'Product 3',
      stages: ['Stage', 'Stage', 'Stage', 'Stage', 'Stage'],
    },
  ];
  batches: any = [
    {
      batchId: 'Batch01',
      createdDate: '2022-09-09',
      dateLastEntry: '2022-09-09',
      currentStage: 'Stage01',
      createdBy: 'Rathnayake',
      images: ['', '', ''],
    },
    {
      batchId: 'Batch02',
      createdDate: '2022-09-09',
      dateLastEntry: '2022-09-09',
      currentStage: 'Stage01',
      createdBy: 'Rathnayake',
      images: ['img.png', 'img.png', 'img.png'],
    },
    {
      batchId: 'Batch03',
      createdDate: '2022-09-09',
      dateLastEntry: '2022-09-09',
      currentStage: 'Stage01',
      createdBy: 'Rathnayake',
      images: ['', '', ''],
    },
  ];
  tdp: any = [
    {
      stage: '1',
      stageName: 'Soil Preparation - 100',
      tdp: {
        operation: 'Compost',
        dateTime: '2022/03/15 04:35PM',
        farm: 'Mabola, Wattala',
        author: 'John Cena',
      },
    },
    {
      stage: '2',
      stageName: 'Soil Preparation - 100',
      tdp: {
        operation: 'Compost',
        dateTime: '2022/03/15 04:35PM',
        farm: 'Mabola, Wattala',
        author: 'John Cena',
      },
    },
    {
      stage: '3',
      stageName: 'Soil Preparation - 100',
      tdp: {
        operation: 'Compost',
        dateTime: '2022/03/15 04:35PM',
        farm: 'Mabola, Wattala',
        author: 'John Cena',
      },
    },
  ];
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  //holds the items user has selected
  selectedProduct: any;
  selectedBatch: any;
  selectedTdp: any;

  //flags to keep track of user's selections
  productIsSelected: boolean = false;
  batchIsSelected: boolean = false;
  tdpIsSelected: boolean = false;

  //search inputs
  productSearchText: string = '';

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private batchesService: BatchesService
  ) {}

  ngOnInit() {
    this.id = this.data.id;
    this.widget = this.data.widget;
    this.products.filterPredicate = (data: any, filter: string) =>
      data.productName.indexOf(filter) != -1;

    this.batchesService.getStages().subscribe((data) => {
      console.log(data);
    });
  }

  //called when user selects a product
  selectProduct(row: any) {
    this.selectedProduct = row;
    this.productIsSelected = true;
    this.goForward();
  }

  //called when user selects a batch
  selectBatch(row: any) {
    this.selectedBatch = row;
    this.batchIsSelected = true;
    this.goForward();
  }

  //called when user selects a tdp
  selectTdp(row: any) {
    this.selectedTdp = row;
    this.tdpIsSelected = true;
  }

  //go back to previous step
  goBack() {
    this.myStepper.previous();
  }

  //move to next step
  goForward() {
    this.myStepper.next();
  }

  //update redux state
  updateReduxState() {
    this.widget = {
      ...this.widget,
      BactchId: this.selectedBatch.batchId,
      ProductName: this.selectedProduct.productName,
    };

    if (this.widget.WidgetType === 'bar') {
      this.store.dispatch(updateBarChart({ chart: this.widget }));
    } else if (this.widget.WidgetType === 'pie') {
      this.store.dispatch(updatePieChart({ chart: this.widget }));
    } else if (this.widget.WidgetType === 'bubble') {
      this.store.dispatch(updateBubbleChart({ chart: this.widget }));
    } else if (this.widget.WidgetType === 'proofbot') {
      this.store.dispatch(updateProofBot({ proofBot: this.widget }));
    } else if (this.widget.WidgetType === 'timeline') {
      this.store.dispatch(updateTimeline({ timeline: this.widget }));
    } else if (this.widget.WidgetType === 'carbon') {
      this.store.dispatch(
        updateCarbonFootprint({ carbonFootprint: this.widget })
      );
    } else if (this.widget.WidgetType === 'table') {
      this.store.dispatch(updateTable({ table: this.widget }));
    }
  }

  openWidgetContent() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        widget: this.widget,
      },
    });
  }

  searchProduct() {
    this.products.filter = this.productSearchText.trim().toLowerCase();
  }

  close() {
    this.dialog.closeAll();
  }
}
