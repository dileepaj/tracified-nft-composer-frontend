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
import { UserserviceService } from 'src/app/services/userservice.service';
import { Children, TimelineData } from 'src/models/nft-content/timeline';
import { selectNFTContent } from 'src/app/store/nft-state-store/nft.selector';
import { ProofBot, ProofData, ProofURL } from 'src/models/nft-content/proofbot';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';

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
  productsLoading: boolean = true;
  batchesLoading: boolean = true;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  continueSaving: boolean = false;
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
    private popupMsgService: PopupMessageService,
    private user: UserserviceService
  ) {}

  ngOnInit() {
    this.id = this.data.id;
    this.userId = this.user.getCurrentUser().UserID;
    this.widget = this.data.widget;
    this.products.filterPredicate = (data: any, filter: string) =>
      data.productName.indexOf(filter) != -1;
    this.getStages();
    this.getItems();
  }

  //called when user selects a product
  public selectProduct(row: any) {
    this.selectedProduct = row;
    this.page = 0;
    this.searchKey = '';
    this.getBatches(this.page, this.searchKey);
    this.productIsSelected = true;
    this.goForward();
  }

  //called when user selects a batch
  public selectBatch(row: any) {
    this.selectedBatch = row;
    this.batchIsSelected = true;
    this.tdpStep = 0;
    this.goForward();
  }

  //called when user selects a tdp
  public selectTdp(row: any) {
    this.selectedTdp = row;
    this.tdpIsSelected = true;
  }

  //go back to previous step
  public goBack() {
    this.myStepper.previous();
  }

  //move to next step
  public goForward() {
    this.myStepper.next();
  }

  //update redux state
  public updateReduxState() {
    if (this.productIsSelected && this.batchIsSelected) {
      if (this.selectedBatch.traceabilityDataPackets.length !== 0) {
        this.saving = true;
        this.widget = {
          ...this.widget,
          Timestamp: new Date().toISOString(),
          BactchId: this.selectedBatch.identifier.identifier,
          ProductName: this.selectedProduct.itemName,
          ProductId: this.selectedProduct.itemID,
          OTPType: 'Batch',
        };

        switch (this.widget.WidgetType) {
          case barchart:
            this.store.dispatch(updateBarChart({ chart: this.widget }));
            this.continueSaving = true;
            break;
          case piechart:
            this.store.dispatch(updatePieChart({ chart: this.widget }));
            this.continueSaving = true;
            break;
          case bubblechart:
            this.store.dispatch(updateBubbleChart({ chart: this.widget }));
            this.continueSaving = true;
            break;
          case proofbot:
            this.getProofbotData();
            this.continueSaving = true;
            break;
          case timeline:
            this.getTimelineData();
            break;
          case carbonFp:
            this.store.dispatch(
              updateCarbonFootprint({ carbonFootprint: this.widget })
            );
            this.continueSaving = true;
            break;
          case table:
            this.store.dispatch(updateTable({ table: this.widget }));
            this.continueSaving = true;
            break;
        }

        if (this.continueSaving) {
          this.saveWidget();
        }
      } else {
        this.popupMsgService.openSnackBar(
          'Please select a batch that has traceability data'
        );
      }
    } else {
      this.popupMsgService.openSnackBar('Please select a product and batch!');
    }
  }

  public openWidgetContent() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        widget: this.widget,
      },
    });
  }

  public close() {
    this.dialog.closeAll();
  }

  public getItemCount(index: number) {
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
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.batchesLoading = false;
        },
      });
  }

  private getItems() {
    this.productsLoading = true;
    this.batchesService.getItems().subscribe({
      next: (data: any) => {
        this.products = data;
        this.productsFilter = this.products;
      },
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
      complete: () => {
        this.productsLoading = false;
      },
    });
  }

  private getStages() {
    this.batchesService.getStages().subscribe({
      next: (data: any) => {
        this.workflow = data.workflow;
        this.workflow[this.workflow.length - 1].stages.map((stage: any) => {
          let stg: any = {};
          this.stages[stage.stageId] = stage.name;
        });
      },
      error: (err) => {
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
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
  }

  public onStepChange(event: any) {
    let index = event.selectedIndex;
  }

  public CamelcaseToWord(string: string) {
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
  }

  private saveWidget() {
    const widget = {
      Timestamp: this.widget.Timestamp,
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
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.popupMsgService.openSnackBar('Saved!!');
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
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
        },
        complete: () => {
          this.saving = false;
          this.popupMsgService.openSnackBar('Saved!!');
          this.close();
        },
      });
    }
  }

  public setTdpStep(index: number) {
    this.tdpStep = index;
  }

  private getTraceabilityData(stageId: number) {
    let tdArr: any = [];
    this.selectedBatch.traceabilityDataPackets.map((data: any) => {
      if (data.stageId === stageId) {
        tdArr.push(data);
      }
    });

    return tdArr;
  }

  private getTimelineData() {
    let b64BatchId = btoa(this.selectedBatch.identifier.identifier);
    let timelineData: TimelineData[] = [];
    this.batchesService.getTimeline(b64BatchId).subscribe((data) => {
      if (data.name === 'Error') {
        this.popupMsgService.openSnackBar(
          'Please select a suitable batch for timeline.'
        );
        this.continueSaving = false;
        this.saving = false;
      } else {
        let tabs = data.tabs;
        let children: any[] = [];

        //loop through tabs array to find timeline object
        for (let i = 0; i < tabs.length; i++) {
          if (data.tabs[i].title == 'Timeline') {
            children = data.tabs[i].children;
            break;
          }
        }

        //check whether the timeline has children or not
        if (children.length > 0) {
          //creates timeline data array
          children.map((child: any) => {
            let data = child.children;
            let tlchildren: Children[] = [];

            //creates children array
            data.map((d: any) => {
              if (d.component === 'key-value') {
                tlchildren.push({ Key: d.key, Value: d.value });
              }
            });

            //create and push timeline child to timeline data array
            timelineData.push({
              Title: child.title,
              Icon: child.icon,
              Children: tlchildren,
            });
          });

          //add timeline data to widget object
          this.widget = {
            ...this.widget,
            TimelineData: timelineData,
            Timestamp: new Date().toISOString(),
          };

          //Update timeline redux state
          this.store.dispatch(updateTimeline({ timeline: this.widget }));
          let status = this.dndService.getSavedStatus(this.widget.WidgetId);

          //check whether timeline is already saved or not
          if (status === false) {
            this.composerService.saveTimeline(this.widget).subscribe({
              next: (res) => {},
              error: (err) => {
                this.popupMsgService.openSnackBar(
                  'An unexpected error occured. Please try again later'
                );
              },
              complete: () => {
                this.dndService.setSavedStatus(this.widget.WidgetId);

                this.popupMsgService.openSnackBar('Saved!!');
                this.dialog.closeAll();
              },
            });
          } else {
            this.composerService.updateTimeline(this.widget).subscribe({
              next: (res) => {},
              error: (err) => {
                this.popupMsgService.openSnackBar(
                  'An unexpected error occured. Please try again later'
                );
              },
              complete: () => {
                this.dndService.setSavedStatus(this.widget.WidgetId);

                this.popupMsgService.openSnackBar('Saved!!');
                this.dialog.closeAll();
              },
            });
          }

          this.continueSaving = true;
        } else {
          this.popupMsgService.openSnackBar('Timeline has no children');
          this.continueSaving = false;
          this.saving = false;
        }
      }
    });
  }

  public getProofbotData() {
    let proofbot: ProofBot;
    this.batchesService
      .getProofbotData(this.selectedBatch.identifier.identifier)
      .subscribe({
        next: (data) => {
          let proofData: ProofData[] = [];
          for (let i = 0; i < data.length; i++) {
            let urls: ProofURL[] = [];

            data[i].AvailableProof.map((proof: string) => {
              urls.push({
                Type: proof,
                Url: `https://tillit-explorer.netlify.app/proof-verification?type=${proof}&txn=${data[i].Txnhash}`,
              });
            });

            proofData.push({
              BatchId: this.selectedBatch.identifier.identifier,
              GatewayIdentifier: data[i].Identifier,
              TxnType: data[i].TxnType,
              TxnHash: data[i].Txnhash,
              AvailableProofs: data[i].AvailableProof,
              Urls: urls,
            });
          }

          proofbot = {
            ...this.widget,
            Data: proofData,
            TenentId: this.selectedBatch.tenantId,
            NFTType: 'ProofBot',
          };

          this.store.dispatch(updateProofBot({ proofBot: proofbot }));

          let status = this.dndService.getBatchStatus(this.widget.WidgetId);
          if (status === false) {
            this.composerService.saveProofbot(proofbot).subscribe({
              error: (err) => {
                this.popupMsgService.openSnackBar('Error!');
              },
              complete: () => {
                this.saving = false;
                this.continueSaving = true;
              },
            });
          } else {
            this.composerService.updateProofbot(proofbot).subscribe({
              error: (err) => {
                this.popupMsgService.openSnackBar('Error!');
              },
              complete: () => {
                this.saving = false;
                this.continueSaving = true;
              },
            });
          }
        },
        error: (err) => {
          this.popupMsgService.openSnackBar('Error!');
          this.saving = false;
        },
      });
  }
}
