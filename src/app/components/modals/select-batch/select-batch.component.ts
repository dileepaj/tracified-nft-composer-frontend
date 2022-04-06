import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Items } from 'src/app/entity/batch';
import { BatchesService } from 'src/app/services/batches.service';
import { AppState } from 'src/app/store/app.state';
import {
  addCardtStatus,
  updateBarChart,
  updateBubbleChart,
  updateCarbonFootprint,
  updatePieChart,
  updateProofBot,
  updateTable,
  updateTimeline,
} from 'src/app/store/nft-state-store/nft.actions';
import { WidgetContentComponent } from '../widget-content/widget-content.component';
import * as MomentAll from 'moment';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import {
  barchart,
  bubblechart,
  carbonFp,
  piechart,
  proofbot,
  table,
  timeline,
} from 'src/models/nft-content/widgetTypes';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { UserserviceService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-select-batch',
  templateUrl: './select-batch.component.html',
  styleUrls: ['./select-batch.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectBatchComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  id: any;
  userId: string = '';
  widget: any;
  chart: any;
  totalBatches: number = 10;
  page: number = 0;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  productsLoading: boolean = true;
  batchesLoading: boolean = true;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  saving: boolean = false;

  tdpStep: number = 0;

  searchKey: string = '';

  tdpColumns: string[] = ['stage', 'stageName', 'tdp'];

  products: any = [];
  productsFilter: any = [];
  stages: any = {};
  workflow: any = [];

  batchesRes: any;
  batches: any = [];
  tdp: any = [];

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
    private batchesService: BatchesService,
    private composerService: ComposerBackendService,
    private dndService: DndServiceService,
    private _snackBar: MatSnackBar,
    private user: UserserviceService
  ) {}

  ngOnInit() {
    this.id = this.data.id;
    console.log('first', this.user.getCurrentUser());
    this.userId = this.user.getCurrentUser().UserID;
    this.widget = this.data.widget;
    this.products.filterPredicate = (data: any, filter: string) =>
      data.productName.indexOf(filter) != -1;
    this.getStages();
    this.getItems();
  }

  //called when user selects a product
  selectProduct(row: any) {
    this.selectedProduct = row;
    this.page = 0;
    this.searchKey = '';
    this.getBatches(this.page, this.searchKey);
    this.productIsSelected = true;
    this.goForward();
  }

  //called when user selects a batch
  selectBatch(row: any) {
    this.selectedBatch = row;
    this.batchIsSelected = true;
    this.tdpStep = 0;
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
    if (this.productIsSelected && this.batchIsSelected) {
      if (this.selectedBatch.traceabilityDataPackets.length !== 0) {
        this.saving = true;
        this.widget = {
          ...this.widget,
          BactchId: this.selectedBatch.identifier.identifier,
          ProductName: this.selectedProduct.itemName,
        };

        if (this.widget.WidgetType === barchart) {
          this.store.dispatch(updateBarChart({ chart: this.widget }));
        } else if (this.widget.WidgetType === piechart) {
          this.store.dispatch(updatePieChart({ chart: this.widget }));
        } else if (this.widget.WidgetType === bubblechart) {
          this.store.dispatch(updateBubbleChart({ chart: this.widget }));
        } else if (this.widget.WidgetType === proofbot) {
          this.store.dispatch(updateProofBot({ proofBot: this.widget }));
        } else if (this.widget.WidgetType === timeline) {
          this.store.dispatch(updateTimeline({ timeline: this.widget }));
        } else if (this.widget.WidgetType === carbonFp) {
          this.store.dispatch(
            updateCarbonFootprint({ carbonFootprint: this.widget })
          );
        } else if (this.widget.WidgetType === table) {
          this.store.dispatch(updateTable({ table: this.widget }));
        }

        this.saveWidget();
      } else {
        this.openSnackBar('Please select a batch that has traceability data');
      }
    } else {
      this.openSnackBar('Please select a product and batch!');
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

  close() {
    this.dialog.closeAll();
  }

  getItemCount(index: number) {
    return this.page * 10 + index + 1;
  }

  public convertDate(date: any): string {
    const stillUtc = MomentAll.utc(date).toDate();
    // MomentAll(date).zone((new Date()).getTimezoneOffset()).format('YYYY-MM-DD hh:mm A')
    const local = MomentAll(date)
      .zone(new Date().getTimezoneOffset())
      .format('YYYY-MM-DD hh:mm A');
    // MomentAll(stillUtc).local().format('LLLL');
    return local;
  }

  public getBatches(index: number, searchKey: string) {
    this.batchesLoading = true;
    this.batchesService
      .getBatch(this.selectedProduct.itemID, 10, index, this.searchKey, '', '')
      .subscribe({
        next: (data: any) => {
          this.batchesRes = data;
          this.batches = this.batchesRes.results;
          this.totalBatches = this.batchesRes.totalCount;
          this.page = index;
        },
        error: (err) => {
          console.log('err', err);
          this.openSnackBar(JSON.parse(err.error.message));
        },
        complete: () => {
          this.batchesLoading = false;
        },
      });
  }

  public getItems() {
    this.productsLoading = true;
    this.batchesService.getItems().subscribe({
      next: (data: any) => {
        this.products = data;
        this.productsFilter = this.products;
      },
      error: (err) => {
        this.openSnackBar(JSON.parse(err.error.message));
      },
      complete: () => {
        this.productsLoading = false;
      },
    });
  }

  public getStages() {
    this.batchesService.getStages().subscribe({
      next: (data: any) => {
        this.workflow = data.workflow;
        this.workflow[this.workflow.length - 1].stages.map((stage: any) => {
          let stg: any = {};
          this.stages[stage.stageId] = stage.name;
          //this.stages.push(stg);
        });
      },
      error: (err) => {
        this.openSnackBar(JSON.parse(err.error.message));
      },
    });
  }

  public searchProduct(event: any) {
    this.productsFilter = this.products.filter((product: any) => {
      if (event.target.value !== '') {
        if (
          product.itemName
            .trim()
            .toLowerCase()
            .includes(event.target.value.trim().toLowerCase())
        ) {
          return product;
        }
      } else {
        return product;
      }
    });
  }

  public searchBatch() {
    this.page = 0;
    this.getBatches(this.page, this.searchKey);
  }

  public onDateChange() {
    this.page = 0;
    /*this.getBatches(
      this.page,
      '',
      this.dateRange.value.start,
      this.dateRange.value.end
    );*/
  }

  onStepChange(event: any) {
    let index = event.selectedIndex;
  }

  public CamelcaseToWord(string: string) {
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
  }

  private saveWidget() {
    const widget = {
      Timestamp: new Date().toISOString(),
      ProjectId: this.widget.ProjectId,
      ProjectName: this.widget.ProjectName,
      WidgetId: this.widget.WidgetId,
      BatchId: this.selectedBatch.identifier.identifier,
      ProductId: this.selectedProduct.itemID,
      ProductName: this.selectedProduct.itemName,
      TenentId: this.selectedBatch.tenantId,
      UserId: this.userId,
      OTP: '',
      Query: '',
      OTPType: 'Batch',
      WidgetType: this.widget.WidgetType,
    };

    let status = this.dndService.getBatchStatus(widget.WidgetId);
    if (status === false) {
      this.composerService.saveWidget(widget).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          console.log('err', err);
          this.openSnackBar(
            err.error.status + ' ' + JSON.parse(err.error.message).err
          );
        },
        complete: () => {
          this.saving = false;
          this.openSnackBar('Saved!!');
          //put the Data save status to sti
          this.store.dispatch(
            addCardtStatus({
              cardStatus: {
                WidgetId: widget.WidgetId,
                WidgetType: widget.WidgetType,
                DataSelected: true,
              },
            })
          );
          this.dndService.setBatchStatus(widget.WidgetId);
          this.close();
        },
      });
    } else {
      this.composerService.updateWidget(widget).subscribe({
        next: (res) => {},
        error: (err) => {
          this.saving = false;
          this.openSnackBar(JSON.parse(err.error.message));
        },
        complete: () => {
          this.saving = false;
          this.openSnackBar('Saved!!');
          this.close();
        },
      });
    }
  }

  setTdpStep(index: number) {
    this.tdpStep = index;
  }

  getTraceabilityData(stageId: number) {
    let tdArr: any = [];
    this.selectedBatch.traceabilityDataPackets.map((data: any) => {
      if (data.stageId === stageId) {
        tdArr.push(data);
      }
    });

    return tdArr;
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar'],
      duration: 5 * 1000,
    });
  }
}
