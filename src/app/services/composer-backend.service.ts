import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chart } from 'src/models/nft-content/chart';
import { Image } from 'src/models/nft-content/image';
//import { RecentProject } from 'src/models/nft-content/htmlGenerator';
import { QueryExecuter } from 'src/models/nft-content/queryExecuter';
import { Table } from 'src/models/nft-content/table';

let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ComposerBackendService {
  private apiUrl: string = 'http://localhost:6081/api';
  constructor(private http: HttpClient) {}

  //Post Query Execute
  public executeQueryAndUpdate(
    query: QueryExecuter
  ): Observable<QueryExecuter> {
    return this.http.post<QueryExecuter>(
      `${this.apiUrl}/query/execute`,
      query,
      httpOptions
    );
  }

  public getRecentProjects(userName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/composer/projcts/ABC`);
  }

  /**
   * @function saveWidget - save widget with the details of selected batch
   * @param - widget
   * @component - select-batch modal
   */
  public saveWidget(widget: any): Observable<any> {
    console.log('request body', widget);
    return this.http.post<any>(`${this.apiUrl}/widget`, widget, httpOptions);
  }

  /**
   * @function saveChart - save chart that resulted after running the query
   * @param - chart
   * @component - configure-bar-chart, configure-bubble-chart and configure-pie-chart modals
   */
  public saveChart(chart: Chart): Observable<Chart> {
    console.log('request body', chart);
    return this.http.post<Chart>(
      `${this.apiUrl}/html/chart`,
      chart,
      httpOptions
    );
  }

  /**
   * @function saveTable - save table that resulted after running the query
   * @param - table
   * @component - configure-table modal
   */
  public saveTable(table: Table): Observable<Table> {
    console.log('request body', table);
    return this.http.post<Table>(
      `${this.apiUrl}/html/table`,
      table,
      httpOptions
    );
  }

  /**
   * @function saveImage - save image widget with base64 converted image
   * @param - image
   * @component - nft-image widget
   */
  public saveImage(image: Image): Observable<Image> {
    console.log('request body', image);
    return this.http.post<Image>(
      `${this.apiUrl}/html/image`,
      image,
      httpOptions
    );
  }
}
