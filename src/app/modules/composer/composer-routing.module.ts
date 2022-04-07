import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComposerComponent } from 'src/app/components/views/composer/composer.component';
import { NftHtmlComponent } from 'src/app/components/views/nft-html/nft-html.component';
import { NftSvgComponent } from 'src/app/components/views/nft-svg/nft-svg.component';
import { ProjectsComponent } from 'src/app/components/views/projects/projects.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: 'projects/:userId',
    canActivate: [AuthGuard],
    component: ProjectsComponent,
  },
  {
    path: 'home/:id',
    canActivate: [AuthGuard],
    component: ComposerComponent,
  },
  {
    path: 'nft-svg',
    canActivate: [AuthGuard],
    component: NftSvgComponent,
  },
  {
    path: 'nft-html',
    canActivate: [AuthGuard],
    component: NftHtmlComponent,
  },
  { path: '', redirectTo: '/layout/home/:id', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComposerRoutingModule {}
