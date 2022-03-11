import { Component, OnInit } from '@angular/core';
import { BatchesService } from 'src/app/service/batches.service';
import { Observable, retry } from 'rxjs';

@Component({
  selector: 'app-test-view',
  templateUrl: './test-view.component.html',
  styleUrls: ['./test-view.component.scss'],
})
export class TestViewComponent implements OnInit {
  public items: any = [];
  public stages: any = [];

  constructor(private _batchService: BatchesService) {}

  ngOnInit(): void {
    this.getItems();
    //this.getStages();
  }

  getItems() {
    console.log('Get items called');
    this.items = this._batchService.getItems().subscribe();
    console.log(this.items);
  }

  getStages() {
    this.stages = this._batchService.getStages().subscribe();
  }
}
