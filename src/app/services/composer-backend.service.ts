import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Chart } from 'src/models/nft-content/chart';
import { Image } from 'src/models/nft-content/image';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { ProofBot } from 'src/models/nft-content/proofbot';
import { QueryExecuter } from 'src/models/nft-content/queryExecuter';
import { Table } from 'src/models/nft-content/table';
import { Timeline } from 'src/models/nft-content/timeline';
import { JwtserviceService } from './jwtservice.service';

@Injectable({
  providedIn: 'root',
})
export class ComposerBackendService {
  private apiUrl: string = environment.composerBackend;
  constructor(private http: HttpClient, private jwt: JwtserviceService) {}

  /**
   * @function setHeaders - set headers for an API request
   * @param none
   */
  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.jwt.getToken() || '',
    };
    return new HttpHeaders(headersConfig);
  }
  //Post Query Execute
  public executeQueryAndUpdate(
    query: QueryExecuter
  ): Observable<QueryExecuter> {
    return this.http.post<QueryExecuter>(
      `${this.apiUrl}/query/execute`,
      query,
      {
        headers: this.setHeaders(),
      }
    );
  }

  public getRecentProjects(userName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${userName}`, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function saveWidget - save widget with the details of selected batch
   * @param - widget
   * @component - select-batch modal
   */
  public saveWidget(widget: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/widget`, widget, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function saveChart - save chart that resulted after running the query
   * @param - chart
   * @component - configure-bar-chart, and configure-pie-chart modals
   */
  public saveChart(chart: Chart): Observable<Chart> {
    return this.http.post<Chart>(`${this.apiUrl}/html/chart`, chart, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function saveTable - save table that resulted after running the query
   * @param - table
   * @component - configure-table modal
   */
  public saveTable(table: Table): Observable<Table> {
    return this.http.post<Table>(`${this.apiUrl}/html/table`, table, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function saveImage - save image widget with base64 converted image
   * @param - image
   * @component - nft-image widget
   */
  public saveImage(image: Image): Observable<Image> {
    return this.http.post<Image>(`${this.apiUrl}/html/image`, image, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function saveTimeline - save timeline widget
   * @param - timeline
   * @component - nft-timeline widget
   */
  public saveTimeline(timeline: Timeline): Observable<Timeline> {
    return this.http.post<Timeline>(`${this.apiUrl}/html/timeline`, timeline, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function saveProofbot - save proofbot widget
   * @param - proofbot
   * @component - nft-proofbot widget
   */
  public saveProofbot(proofbot: ProofBot): Observable<ProofBot> {
    return this.http.post<ProofBot>(`${this.apiUrl}/html/proofbot`, proofbot, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function generateHTML - generate HTML code
   * @param - nftContent
   * @component - composer view
   */
  public generateHTML(nftContent: NFTContent): Observable<NFTContent> {
    return this.http.post<NFTContent>(`${this.apiUrl}/generate`, nftContent, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function generateSVG - generate SVG code
   * @param - nftContent
   * @component - nft-svg view
   */
  public generateSVG(nftContent: NFTContent): Observable<NFTContent> {
    return this.http.post<NFTContent>(
      `${this.apiUrl}/generate/svg`,
      nftContent,
      {
        headers: this.setHeaders(),
      }
    );
  }

  /**
   * @function saveProject - save NFT project
   * @param - project
   * @component - composer view
   */
  public saveProject(project: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/project`, project, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function updateWidget - update widget with the details of selected batch
   * @param - widget
   * @component - select-batch modal
   */
  public updateWidget(widget: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/widget`, widget, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function updateProject - update existing NFT project
   * @param - project
   * @component - composer view
   */
  public updateProject(project: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/project`, project, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function updateChart - update chart that resulted after running the query
   * @param - chart
   * @component - configure-bar-chart and configure-pie-chart modals
   */
  public updateChart(chart: Chart): Observable<Chart> {
    return this.http.put<Chart>(`${this.apiUrl}/html/chart`, chart, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function updateTable - udpate table that resulted after running the query
   * @param - table
   * @component - configure-table modal
   */
  public updateTable(table: Table): Observable<Table> {
    return this.http.put<Table>(`${this.apiUrl}/html/table`, table, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function updateTimeline - udpate timeline
   * @param - timeline
   * @component - select-batch modal
   */
  public updateTimeline(timeline: Timeline): Observable<Timeline> {
    return this.http.put<Timeline>(`${this.apiUrl}/html/timeline`, timeline, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function updateProofbot - update proofbot widget
   * @param - proofbot
   * @component - nft-proofbot widget
   */
  public updateProofbot(proofbot: ProofBot): Observable<ProofBot> {
    return this.http.put<ProofBot>(`${this.apiUrl}/html/proofbot`, proofbot, {
      headers: this.setHeaders(),
    });
  }

  public openExistingProject(projectId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/project/${projectId}`, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function deleteProject - delete an existing project
   * @param - projectId
   * @component - projects view
   */
  public deleteProject(projectId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/html/project/${projectId}`, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function deleteChart - delete chart
   * @param - widgetId
   * @component - bar-chart-widget, pie-chart-widget
   */
  public deleteChart(widgetId: string): Observable<Chart> {
    return this.http.delete<Chart>(`${this.apiUrl}/html/chart/${widgetId}`, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function deleteTable - delete table
   * @param - widgetId
   * @component - table widget
   */
  public deleteTable(widgetId: string): Observable<Table> {
    return this.http.delete<Table>(`${this.apiUrl}/html/table/${widgetId}`, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function deleteImage - delete image
   * @param - widgetId
   * @component - nft-image
   */
  public deleteImage(widgetId: string): Observable<Image> {
    return this.http.delete<Image>(`${this.apiUrl}/html/image/${widgetId}`, {
      headers: this.setHeaders(),
    });
  }

  /**
   * @function deleteTimeline - delete timeline
   * @param - widgetId
   * @component - nft-timeline
   */
  public deleteTimeline(widgetId: string): Observable<Timeline> {
    return this.http.delete<Timeline>(
      `${this.apiUrl}/html/timeline/${widgetId}`,
      {
        headers: this.setHeaders(),
      }
    );
  }

  /**
   * @function deleteProofbot - delete proofbot
   * @param - widgetId
   * @component - nft-proofbot
   */
  public deleteProofbot(widgetId: string): Observable<ProofBot> {
    return this.http.delete<ProofBot>(
      `${this.apiUrl}/html/proofbot/${widgetId}`,
      {
        headers: this.setHeaders(),
      }
    );
  }

  /**
   * @function updateImage - update image widget with base64 converted image
   * @param - image
   * @component - nft-image widget
   */
  public updateImage(image: Image): Observable<Image> {
    return this.http.put<Image>(`${this.apiUrl}/html/image`, image, {
      headers: this.setHeaders(),
    });
  }
}
