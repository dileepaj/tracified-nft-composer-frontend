import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import { RecentProject } from 'src/models/nft-content/htmlGenerator';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects:RecentProject[]
  gridColumns = 4;
  constructor(
    private router:Router,
    private apiService:ComposerBackendService) { }

  ngOnInit(): void {
    console.log('hiiii')

    this.apiService.getRecentProjects("ABC").subscribe((result) => {
      if (result) {
        console.log('result-------------------', result)
        this.projects=result
      }
    });
  }

  openNewProject(){
    this.router.navigate(['/layouts']);
  }
}
