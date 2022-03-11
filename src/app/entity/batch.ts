import { Data } from '@angular/router';

export interface Workflow {
  stages: Data[];
  name: string;
  tenantId: string;
  revision: string;
  ecommerceStage: string;
  version: string;
}

export class Items {
  _itemID: string;
  itemName: string;
  stages: Data[];
  tenantId: string;
}

export interface TracibilityProfile {
  _links: Data[];
  limit: number;
  page: number;
  results: Data[];
  totalCount: number;
}
