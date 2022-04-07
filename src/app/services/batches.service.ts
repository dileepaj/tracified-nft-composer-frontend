import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { Items, Workflow } from 'src/app/entity/batch';
import { UserserviceService } from './userservice.service';
import { TracibilityProfileWithTimeline } from '../entity/timeline';

@Injectable({
  providedIn: 'root',
})
export class BatchesService {
  public backend: any;
  public admin: any;
  public _tenantId = this.userService.getCurrentUser().TenentId;

  constructor(
    private apiService: ApiService,
    private userService: UserserviceService
  ) {
    this.backend = environment.backendUrl;
    this.admin = environment.adminUrl;
  }
  ngOnInit() {
    this._tenantId = this.userService.getCurrentUser().TenentId;
  }
  /**
   * @function getItems - get items for a particular tenent
   * @screen - the products view(popup screens)
   * @params - none
   */
  public getItems(): Observable<Items[]> {
    return this.apiService.get(this.admin + '/api/findItemByTenant/');
  }

  /**
   * @function getStages - get batches for a particular item
   * @screen - the products view(popup screens)
   */
  public getStages(): Observable<Workflow[]> {
    return this.apiService.get(this.admin + '/api/workflow/' + this._tenantId);
  }

  /**
   * @function getBatch - get batches for a particular item
   * @param - itemID, limit, page, search key, fromDate, toDate
   * @screen - the products view(popup screens)
   */
  public getBatch(
    itemID: string,
    limit: number,
    page: number,
    searchKey: string,
    fromDate: string,
    toDate: string
  ): Observable<any> {
    const url =
      this.backend +
      '/api/v2/traceabilityProfiles?itemID=' +
      itemID +
      '&q=' +
      searchKey +
      '&limit=' +
      limit +
      '&page=' +
      page +
      '&sortingField=timestamp&sortingType=-1&' +
      'isActive=true&toDate=' +
      toDate +
      '&fromDate=' +
      fromDate;
    return this.apiService.get(url);
  }

  //get timeline for the widget
  public getTimeline(): Observable<any> {
    return this.apiService.get(
      'https://qa.api.tracified.com/api/v2/traceabilityProfiles/customer/SGFuYU1hdE5zcDAx'
    );
  }
}
