import { Component, OnInit } from '@angular/core';
import { BatchesService } from 'src/app/services/batches.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { Items, Workflow } from 'src/app/entity/batch';
import { Template , ArtifactDetails, Data} from 'src/app/entity/artifact';

@Component({
  selector: 'app-test-view',
  templateUrl: './test-view.component.html',
  styleUrls: ['./test-view.component.scss'],
})
export class TestViewComponent implements OnInit {
  public items: Items[];
  public stages: Workflow[];
  public template: Template[];
  public artifactDetails: ArtifactDetails[];
  public data : Data[];

  private id = '60cb402eb9876b7a239de6fd';

  constructor(
    private _batchService: BatchesService,
    private _artifactService: ArtifactService
  ) {}

  ngOnInit(): void {
    // this.getItems();
    // this.getStages();
    // this.getArtifacts();
    this.getArtifactDataById();
  }

  getItems() {
    this._batchService.getItems().subscribe((data) => {
      this.items = data;
    });
  }

  getStages() {
    this._batchService.getStages().subscribe((data) => {
      this.stages = data;
    });
  }

  getArtifacts() {
    this._artifactService.getArtifacts().subscribe((data) => {
      this.template = data;
    });
  }

  getArtifactDataById() {
    this._artifactService.getArtifactDataById(this.id).subscribe((data) => {
      this.artifactDetails = data;
    });
  }
}
