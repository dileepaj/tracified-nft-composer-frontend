import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { Template, ArtifactDetails } from '../entity/artifact';

@Injectable({
  providedIn: 'root',
})
export class ArtifactService {
  public backend: any;

  constructor(private apiService: ApiService) {
    this.backend = environment.backendUrl + '/api/v2';
  }

  /**
   * @function getArtifacts - get the artifacts
   * @screen - artifact selection initial page
   * @params - none
   */
  public getArtifacts(): Observable<Template[]> {
    return this.apiService.get(this.backend + '/artifacts/templates/');
  }

  /**
   * @function getArtifactDataById - get the artifacts
   * @screen - artifact selection initial page
   * @params - none
   */
  public getArtifactDataById(id: string): Observable<ArtifactDetails[]> {
    return this.apiService.get(this.backend + '/artifacts/data/' + id);
  }
}
