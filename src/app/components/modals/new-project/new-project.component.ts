import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  Form,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { lastValueFrom } from 'rxjs';
import { DndServiceService } from 'src/app/services/dnd-service.service';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { AppState } from 'src/app/store/app.state';
import {
  newProject,
  resetStore,
} from 'src/app/store/nft-state-store/nft.actions';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { ComposerUser } from 'src/models/user';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
})
export class NewProjectComponent implements OnInit {
  projectNameControl: FormControl;
  nftNameControl: FormControl;
  descriptionControl: FormControl;
  projectName: string = '';
  nftName: string = '';
  description: string = '';
  user: ComposerUser;
  existingProjects: any[] = [];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private dndService: DndServiceService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private popupMsgService: PopupMessageService,
    private userServices: UserserviceService
  ) {}

  ngOnInit(): void {
    this.user = this.userServices.getCurrentUser();
    this.existingProjects = this.data.existingProjects;
    this.projectNameControl = new FormControl(this.projectName, [
      Validators.required,
      this.forbiddenNameValidator(),
      this.noSpecialCharacters(),
    ]);
    this.nftNameControl = new FormControl(this.nftName, [
      Validators.required,
      this.noSpecialCharacters(),
    ]);
    this.descriptionControl = new FormControl(this.description, [
      Validators.required,
    ]);
  }

  /**
   * @function createProject - create a new NFT project
   */
  public createProject() {
    if (
      this.projectName !== '' &&
      this.nftName !== '' &&
      this.description !== ''
    ) {
      if (!this.checkIfAlreadyExists(this.projectName)) {
        const project: NFTContent = {
          ProjectId: Date.now().toString(),
          ProjectName: this.projectName,
          NFTName: this.nftName,
          Description: this.description,
          UserId: this.user.UserID,
          TenentId: this.user.TenentId,
          Timestamp: new Date().toISOString(),
          CreatorName: '',
          ContentOrderData: [],
          NFTContent: {
            BarCharts: [],
            PieCharts: [],
            Tables: [],
            Images: [],
            Timeline: [],
            ProofBot: [],
            Stats: [],
            CarbonFootprint: [],
          },
        };
        sessionStorage.setItem('NFTCom', JSON.stringify(project));
        sessionStorage.setItem('composerNewProject', '1');
        this.store.dispatch(resetStore());
        this.store.dispatch(newProject({ nftContent: project }));
        this.dndService.rewriteWidgetArr([]);
        sessionStorage.setItem('composerProjectId', project.ProjectId);
        this.router.navigate([`/layout/home/${project.ProjectId}`]);
        this.dialog.closeAll();
      } else {
        this.popupMsgService.openSnackBar(
          'A project with the same name already exists '
        );
      }
    } else {
      this.popupMsgService.openSnackBar(
        'Please provide all the necessary details'
      );
    }
  }

  /**
   * @function checkIfAlreadyExists - check if the given project name already exists.
   */
  private checkIfAlreadyExists(newProjectName: string) {
    let projectNameExists = false;
    if (newProjectName !== '') {
      if (this.existingProjects) {
        for (let i = 0; i < this.existingProjects.length; i++) {
          if (
            newProjectName.trim().toLowerCase() ===
            this.existingProjects[i].ProjectName.trim().toLowerCase()
          ) {
            projectNameExists = true;
            break;
          }
        }
      }
    }
    return projectNameExists;
  }

  private forbiddenNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = this.checkIfAlreadyExists(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  private noSpecialCharacters(): ValidatorFn {
    return (control: AbstractControl): any => {
      setTimeout(() => {
        if (control.value && control.value != '') {
          let trimedvalue = control.value.replace(/[^a-zA-Z0-9 ]/gm, '');
          control.setValue(trimedvalue);
        }
      }, 10);
    };
  }

  //check if project name and nft name exceeds the character limit
  public characterLimitValidator(event: any) {
    const val = event.target.value;
    const id = event.target.id;
    const key = event.keyCode || event.charCode;

    if (val.length === 10 && key >= 48 && key <= 90) {
      if (id === 'projectName') {
        this.popupMsgService.showOnce(
          'Project name is limited to 10 characters'
        );
      } else if (id === 'nftName') {
        this.popupMsgService.showOnce('NFT name is limited to 10 characters');
      }
    }
  }

  //check if the description exceeds the character limit
  public descriptionLimitValidator(event: any) {
    const val = event.target.value;
    const key = event.keyCode || event.charCode;

    if (val.length === 80 && key !== 8 && key !== 13 && key !== 27) {
      this.popupMsgService.showOnce('Description is limited to 80 characters');
    }
  }
}
