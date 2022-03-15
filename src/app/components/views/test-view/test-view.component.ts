import { Component, OnInit } from '@angular/core';
import { BatchesService } from 'src/app/services/batches.service';
import { Items, Workflow } from 'src/app/entity/batch';

@Component({
  selector: 'app-test-view',
  templateUrl: './test-view.component.html',
  styleUrls: ['./test-view.component.scss'],
})
export class TestViewComponent implements OnInit {
  public items: Items[];
  public stages: Workflow[];

  constructor(private _batchService: BatchesService) {}

  ngOnInit(): void {
    this.getItems();
    this.getStages();
  }

  getItems() {
    this._batchService.getItems().subscribe((data) => {
      this.items = data;
      console.log('Item data', data);
      console.log('Items ', this.items);
    });
  }

  getStages() {
    this._batchService.getStages().subscribe((data) => {
      this.stages = data;
      console.log('Stage Data', data);
      console.log('Stages ', this.stages);
    });
  }
}
