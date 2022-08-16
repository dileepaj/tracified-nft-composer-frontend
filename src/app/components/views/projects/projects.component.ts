import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { AppState } from 'src/app/store/app.state';
import {
  loadProject,
  setCardStatus,
  setQueryResult,
  setWidgetCount,
} from 'src/app/store/nft-state-store/nft.actions';
import { Chart } from 'src/models/nft-content/chart';
import { RecentProject } from 'src/models/nft-content/htmlGenerator';
import { Image } from 'src/models/nft-content/image';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { ProofBot } from 'src/models/nft-content/proofbot';
import { Table } from 'src/models/nft-content/table';
import { Timeline } from 'src/models/nft-content/timeline';
import { NewProjectComponent } from '../../modals/new-project/new-project.component';
import { Widget } from '../composer/composer.component';
import { ComposerUser } from 'src/models/user';
import { CardStatus, QueryResult } from 'src/models/nft-content/cardStatus';

import * as MomentAll from 'moment';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { DeleteProjectComponent } from '../../modals/delete-project/delete-project.component';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: RecentProject[];
  filteredProjects: RecentProject[];
  loadedProject: NFTContent;
  subscription: Subscription;
  gridColumns = 4;
  user: ComposerUser;
  userId: string = '';
  loading: boolean = false;
  projLoading: boolean = false;
  projToBeDeleted: string = '';
  backgroundColorArray: string[] = [
    '#FFEBEE',
    '#F3E5F5',
    '#E3F2FD',
    '#E0F7FA',
    '#E8F5E9',
    '#FFF8E1',
    '#FBE9E7',
    '#E8EAF6',
    '#E0F2F1',
    '#FCE4EC',
  ];
  fontColorArray: string[] = [
    '#E57373',
    '#BA68C8',
    '#90CAF9',
    '#4DD0E1',
    '#81C784',
    '#FFD54F',
    '#FF8A65',
    '#7986CB',
    '#4DB6AC',
    '#F06292',
  ];
  projectColors: any = [];

  listView: boolean = false;
  gridView: boolean = true;

  searchText: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ComposerBackendService,
    private dndService: DndServiceService,
    public dialog: MatDialog,
    private userServices: UserserviceService,
    private projectLoader: ProjectLoaderService
  ) {}

  ngOnInit(): void {
    this.user = this.userServices.getCurrentUser();
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') || '';
    });
    this.getRecentProjects();
    sessionStorage.setItem('composerRefreshed', '0');
  }

  /**
   * @function getRecentProjects - get user's recent projects
   */
  public getRecentProjects() {
    this.loading = true;
    this.apiService.getRecentProjects(this.userId).subscribe((result) => {
      if (result) {
        this.projects = [];
        this.filteredProjects = [];
        if (result.Response) {
          this.projects = result.Response;
          this.filteredProjects = this.projects;
          this.generateColors();
        }
      }
      this.loading = false;
    });
  }

  /**
   * @function generateColors - generate colors for each project.
   * These colors are used in projects view when displaying recent projects
   */
  private generateColors() {
    this.projects.map((project) => {
      let random = Math.floor(Math.random() * 3);
      this.projectColors.push({
        ProjectId: project.ProjectId,
        bgColor: this.backgroundColorArray[random],
        fontColor: this.fontColorArray[random],
      });
    });
  }

  /**
   * @function getRandomBgColor - get bg color generated for a specific project
   */
  public getBgColor(projectId: string): string {
    let color: string = '';
    for (let i = 0; i < this.projectColors.length; i++) {
      if (this.projectColors[i].ProjectId === projectId) {
        color = this.projectColors[i].bgColor;
        break;
      }
    }

    return color;
  }

  /**
   * @function getFontColor - get font color generated for a specific project
   */
  public getFontColor(projectId: string): string {
    let color: string = '';
    for (let i = 0; i < this.projectColors.length; i++) {
      if (this.projectColors[i].ProjectId === projectId) {
        color = this.projectColors[i].fontColor;
        break;
      }
    }

    return color;
  }

  /**
   * @function convertDate - convert date format
   */
  public convertDate(date: any): string {
    const local = MomentAll(date)
      .zone(new Date().getTimezoneOffset())
      .format('MMM D, YYYY');
    return local;
  }

  /**
   * @function openNewProject - open new project popup
   */
  public openNewProject() {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        user: this.user,
        existingProjects: this.projects,
      },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  /**
   * @function openExistingProject - open existing project.
   * all the project content should be stored in the redux stroe
   */
  public openExistingProject(id: string) {
    this.projLoading = true;

    //load project
    this.projectLoader.loadExistingProject(id, (projId: string) => {
      sessionStorage.setItem('composerRefreshed', '0');
      sessionStorage.setItem('composerNewProject', '0');
      this.router.navigate([`/layout/home/${projId}`]);
      this.projLoading = false;
    });
  }

  /**
   * @function deleteProject - delete an existing project
   */
  public deleteProject(projectId: string, projectName: string) {
    this.projToBeDeleted = projectId;
    const dialogRef = this.dialog.open(DeleteProjectComponent, {
      data: {
        projectId: projectId,
        projectName: projectName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.projToBeDeleted = '';
        this.getRecentProjects();
      }
    });
  }

  public showGridView() {
    this.gridView = true;
    this.listView = false;
  }

  public showListView() {
    this.listView = true;
    this.gridView = false;
  }

  public searchProject() {
    this.filteredProjects = this.projects.filter((project: any) => {
      if (this.searchText !== '') {
        if (
          project.ProjectName.trim()
            .toLowerCase()
            .includes(this.searchText.trim().toLowerCase())
        ) {
          return project;
        }
      } else {
        return project;
      }
    });
  }

  public toggleSort() {
    this.filteredProjects = this.filteredProjects.reverse();
  }
}
