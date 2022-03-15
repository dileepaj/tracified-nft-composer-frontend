import { Data } from '@angular/router';

export class Workflow {
  stages: Array<object>;
  name: string;
  tenantId: string;
  revision: string;
  ecommerceStage: string;
  version: string;
}

export class Items {
  itemID: string;
  itemName: string;
  stages: Array<object>;
  tenantId: string;

}

export interface TracibilityProfile {
  _links: Array<object>;
  limit: number;
  page: number;
  results: Array<object>;
  totalCount: number;
}

