import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { RecentProject } from 'src/models/nft-content/htmlGenerator';
import { QueryExecuter } from 'src/models/nft-content/queryExecuter';

let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ComposerBackendService {
  constructor(private http: HttpClient) {}

  //Post Query Execute
  executeQueryAndUpdate(query: QueryExecuter): Observable<QueryExecuter> {
    return this.http.post<QueryExecuter>(
      'http://localhost:6081/api/composer/query/execute',
      query,
      httpOptions
    );
  }

  getRecentProjects(userName: string): Observable<any> {
    return this.http.get('http://localhost:6081/api/composer/projcts/ABC');
  }
}
