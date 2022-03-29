import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chart } from 'src/models/nft-content/chart';
import { Image } from 'src/models/nft-content/image';
import { NFTContent } from 'src/models/nft-content/nft.content';
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
    return this.http.get(`${this.apiUrl}/projects/${userName}`);
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

  /**
   * @function generateHTML - generate HTML code
   * @param - nftContent
   * @component - composer view
   */
  public generateHTML(nftContent: NFTContent): Observable<NFTContent> {
    console.log(nftContent);
    return this.http.post<NFTContent>(
      `${this.apiUrl}/generate`,
      nftContent,
      httpOptions
    );
  }

  /**
   * @function saveProject - save NFT project
   * @param - project
   * @component - composer view
   */
  public saveProject(project: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/project`, project, httpOptions);
  }

  /**
   * @function updateWidget - update widget with the details of selected batch
   * @param - widget
   * @component - select-batch modal
   */
  public updateWidget(widget: any): Observable<any> {
    console.log('request body', widget);
    return this.http.put<any>(`${this.apiUrl}/widget`, widget, httpOptions);
  }

  /**
   * @function updateProject - update existing NFT project
   * @param - project
   * @component - composer view
   */
  public updateProject(project: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/project`, project, httpOptions);
  }

  /**
   * @function updateChart - update chart that resulted after running the query
   * @param - chart
   * @component - configure-bar-chart, configure-bubble-chart and configure-pie-chart modals
   */
  public updateChart(chart: Chart): Observable<Chart> {
    console.log('request body', chart);
    return this.http.put<Chart>(
      `${this.apiUrl}/html/chart`,
      chart,
      httpOptions
    );
  }

  /**
   * @function updateTable - udpate table that resulted after running the query
   * @param - table
   * @component - configure-table modal
   */
  public updateTable(table: Table): Observable<Table> {
    console.log('request body', table);
    return this.http.put<Table>(
      `${this.apiUrl}/html/table`,
      table,
      httpOptions
    );
  }

  public openExistingProject(projectId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/project/${projectId}`);
  }
}
