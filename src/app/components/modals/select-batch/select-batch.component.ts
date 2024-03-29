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
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { BatchesService } from 'src/app/services/batches.service';
import { AppState } from 'src/app/store/app.state';
import {
  addCardtStatus,
  projectUnsaved,
  updateBarChart,
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
import { MatInput } from '@angular/material/input';
import { MatDateRangePicker } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-select-batch',
  templateUrl: './select-batch.component.html',
  styleUrls: ['./select-batch.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectBatchComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild('from', { read: MatInput }) fromInput: MatInput;
  @ViewChild('to', { read: MatInput }) toInput: MatInput;
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

  saving: boolean = false;

  tdpStep: number = 0;

  searchKey: string = '';
  fromDate: string = '';
  toDate: string = '';
  showClearDate: boolean = false;

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
  traceabilityDataPackets: any[] = [];

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
    private user: UserserviceService,
    public dialogRef: MatDialogRef<SelectBatchComponent>
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

  /**
   * @function selectProduct - called when user selects a product
   * @param row
   */
  public selectProduct(row: any) {
    this.selectedProduct = row;
    this.page = 0;
    this.searchKey = '';
    this.getBatches(this.page, this.searchKey, '', '');
    this.productIsSelected = true;
    this.goForward();
  }

  /**
   * @function selectBatch - called when user selects a batch
   * @param row
   */
  public selectBatch(row: any) {
    this.selectedBatch = row;
    this.batchIsSelected = true;
    this.tdpStep = 0;
    const identifier = JSON.stringify({
      id: row.identifier.identifier,
      type: row.identifier.type,
    });
    this.batchesService
      .getTraceablityData(btoa(identifier))
      .subscribe((data) => {
        this.createTdpArray(data.reverse());
        this.goForward();
      });
  }
  /**
   * @function createTdpArray - creates an array of tdp which is used to display traceability data
   * @param data
   */
  private createTdpArray(data: any) {
    let bigArr: any = [];
    data.map((arr: any) => {
      let stageID: string = arr[0].stageID;
      let tdps: any = [];
      arr.map((data: any) => {
        tdps = [...tdps, ...data.traceabilityDataPackets];
      });
      bigArr.push({ stageID: stageID, traceabilityDataPackets: tdps });
    });
    this.traceabilityDataPackets = bigArr;
  }

  /**
   * @function getKeyArray - returns an array of keys in a object
   * @param object
   */
  public getKeyArray(object: any) {
    return Object.keys(object);
  }

  /**
   * @function goBack - called when user go back to previous step
   */
  public goBack() {
    this.myStepper.previous();
  }

  /**
   * @function goForward - moves to next step
   */
  public goForward() {
    this.myStepper.next();
  }

  /**
   * @function updateReduxState - mupdate redux state
   */
  public updateReduxState() {
    if (this.productIsSelected && this.batchIsSelected) {
      if (this.traceabilityDataPackets.length !== 0) {
        this.saving = true;
        this.widget = {
          ...this.widget,
          Timestamp: new Date().toISOString(),
          BatchId: this.selectedBatch.identifier.identifier,
          ProductName: this.selectedProduct.itemName,
          ProductId: this.selectedProduct.itemID,
          OTPType: 'Batch',
        };

        switch (this.widget.WidgetType) {
          case barchart:
            this.store.dispatch(updateBarChart({ chart: this.widget }));
            this.saveWidget();
            break;
          case piechart:
            this.store.dispatch(updatePieChart({ chart: this.widget }));
            this.saveWidget();
            break;
          case proofbot:
            this.getProofbotData();
            break;
          case timeline:
            this.getTimelineData();
            break;
          case carbonFp:
            this.store.dispatch(
              updateCarbonFootprint({ carbonFootprint: this.widget })
            );
            this.saveWidget();
            break;
          case table:
            this.store.dispatch(updateTable({ table: this.widget }));
            this.saveWidget();
            break;
        }
      } else {
        this.popupMsgService.openSnackBar(
          'Please select a batch that has traceability data'
        );
      }
    } else {
      this.popupMsgService.openSnackBar('Please select a product and batch');
    }
  }

  public checkType(x:any) {
    if (typeof x === 'object' && JSON.stringify(x).startsWith('{')) {
        return 'object';
    } else if (Array.isArray(x)) {
        return 'array';
    } else {
        return typeof x;
    }
}

  /**
   * @function openWidgetContent - open widget content
   */
  public openWidgetContent() {
    const dialogRef = this.dialog.open(WidgetContentComponent, {
      data: {
        id: this.id,
        widget: this.widget,
      },
      autoFocus: false,
    });

    this.dialogRef.close();
  }

  /**
   * @function close - close the popup
   */
  public close() {
    this.dialog.closeAll();
  }

  /**
   * @function getItemCount - get the item count
   * @param index
   */
  public getItemCount(index: number) {
    return this.page * 10 + index + 1;
  }

  /**
   * @function convertDate - convert the date format
   * @param date
   */
  public convertDate(date: any): string {
    const stillUtc = MomentAll.utc(date).toDate();
    // MomentAll(date).zone((new Date()).getTimezoneOffset()).format('YYYY-MM-DD hh:mm A')
    const local = MomentAll(date)
      .zone(new Date().getTimezoneOffset())
      .format('YYYY-MM-DD hh:mm A');
    // MomentAll(stillUtc).local().format('LLLL');
    return local;
  }

  /**
   * @function getBatches - get the item count
   * @param index
   */
  public getBatches(
    index: number,
    searchKey: string,
    fromDate: string,
    toDate: string
  ) {
    this.batchesLoading = true;
    this.batchesService
      .getBatch(
        this.selectedProduct.itemID,
        10,
        index,
        this.searchKey,
        fromDate,
        toDate
      )
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

  /**
   * @function getItems - get the items
   */
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

  /**
   * @function getStages - get stages
   */
  private getStages() {
    this.batchesService.getStages().subscribe({
      next: (data: any) => {
        this.workflow = data.workflow;
        this.workflow.stages.map((stage: any) => {
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

  /**
   * @function searchProduct - called when product is searched
   * @param event
   */
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

  /**
   * @function searchBatch - called when a batch is seaarched
   */
  public searchBatch() {
    this.page = 0;
    this.getBatches(this.page, this.searchKey, this.fromDate, this.toDate);
  }

  /**
   * @function onDateChange - called when searching using dates
   */
  public onDateChange(from: HTMLInputElement, to: HTMLInputElement) {
    this.fromDate = from.value.split('/').reverse().join('-');
    this.toDate = to.value.split('/').reverse().join('-');
    this.page = 0;
    this.getBatches(0, this.searchKey, this.fromDate, this.toDate);
    this.showClearDate = true;
  }

  /**
   * @function onStepChange - event occures when steps are changed on the batch selection
   * @param event
   */
  public onStepChange(event: any) {
    let index = event.selectedIndex;
  }

  /**
   * @function CamelcaseToWord - change the string to an upper case
   * @param string
   */
  public CamelcaseToWord(string: string) {
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
  }

  /**
   * @function saveWidget - save the selected batch for the widget
   */
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
          this.popupMsgService.openSnackBar(
            'Data added to the widget successfully!'
          );
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
          this.store.dispatch(projectUnsaved());
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
          this.popupMsgService.openSnackBar(
            'Data updated in the widget successfully!'
          );
          this.store.dispatch(projectUnsaved());
          this.close();
        },
      });
    }
  }

  /**
   * @function setTdpStep - set TDP steps
   * @param index
   */
  public setTdpStep(index: number) {
    this.tdpStep = index;
  }

  /**
   * @function getTraceabilityData - get the traceability data
   * @param stageId
   */
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
    let timelineData: TimelineData[] = [];
    let count = 0;

    for (let i = 0; i < this.workflow.stages.length; i++) {
      this.traceabilityDataPackets.map((data) => {
        let Title = '';
        let children: Children[] = [];
        let images: string[] = [];
        let split = true;

        if (this.workflow.stages[i].stageId === data.stageID) {
          Title = this.workflow.stages[i].name;
          data.traceabilityDataPackets.map((tdp: any) => {
            split = true;

            tdp.traceabilityData.map((d: any) => {
              if (d.type === 3) {
                if (!split) {
                  children.push({
                    NewTDP: false,
                    Timestamp: this.convertDate(tdp.timestamp),
                    Key: this.CamelcaseToWord(d.key),
                    Value: this.convertDate(d.val),
                  });
                  count++;
                } else {
                  children.push({
                    NewTDP: true,
                    Timestamp: this.convertDate(tdp.timestamp),
                    Key: this.CamelcaseToWord(d.key),
                    Value: this.convertDate(d.val),
                  });
                  count++;
                  split = false;
                }
              } else if (d.type === 4) {
                d.val.map((img: any) => {
                  images.push(img.image);
                });
                count++;
              }
            });
          });

          timelineData.push({
            Title: Title,
            SubTitle: '',
            Children: children,
            Images: images,
            Icon: 'https://s3.ap-south-1.amazonaws.com/tracified-image-storage/mobile/stage-icons/Harvesting+stage.png',
          });
        }
      });
    }

    if (count > 0) {
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
            this.dndService.setBatchStatus(this.widget.WidgetId);
            this.saving = false;
            this.popupMsgService.openSnackBar(
              'Timeline data added successfully!'
            );
            this.store.dispatch(projectUnsaved());
            this.close();
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
            this.saving = false;
            this.popupMsgService.openSnackBar(
              'Timeline data updated successfully!'
            );
            this.store.dispatch(projectUnsaved());
            this.close();
          },
        });
      }
    } else {
      this.saving = false;
      this.popupMsgService.openSnackBar('Not enough data to create timeline');
    }
  }

  /**
   * @function getProofbotData - get proofbot data
   */
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
                Url: `http://qa.proofbot.tillit.world?type=${proof}&txn=${data[i].Txnhash}`,
              });
            });

            proofData.push({
              BatchId: this.selectedBatch.identifier.identifier,
              GatewayIdentifier: data[i].Identifier,
              TxnType: data[i].TxnType,
              TxnHash: data[i].Txnhash,
              AvailableProofs: data[i].AvailableProof,
              Urls: urls,
              Timestamp: moment(data[i].Timestamp).toString(),
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
                this.popupMsgService.openSnackBar(
                  'An unexpected error occured. Please try again later'
                );
              },
              complete: () => {
                this.saving = false;
                this.dndService.setSavedStatus(this.widget.WidgetId);
                this.dndService.setBatchStatus(this.widget.WidgetId);
                this.popupMsgService.openSnackBar(
                  'Proof Bot data added successfully!'
                );
                this.store.dispatch(projectUnsaved());
                this.close();
              },
            });
          } else {
            this.composerService.updateProofbot(proofbot).subscribe({
              error: (err) => {
                this.popupMsgService.openSnackBar(
                  'An unexpected error occured. Please try again later'
                );
              },
              complete: () => {
                this.saving = false;
                this.popupMsgService.openSnackBar(
                  'Proof Bot data updated successfully!'
                );
                this.store.dispatch(projectUnsaved());
                this.close();
              },
            });
          }
        },
        error: (err) => {
          this.popupMsgService.openSnackBar(
            'An unexpected error occured. Please try again later'
          );
          this.saving = false;
        },
      });
  }

  public resetDate() {
    this.dateRange.reset();
    this.getBatches(0, this.searchKey, '', '');
    this.showClearDate = false;
  }
}
