import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComposerComponent } from './components/views/composer/composer.component';
import { LoginComponent } from './components/views/login/login.component';
import { NftHtmlComponent } from './components/views/nft-html/nft-html.component';
import { NftSvgComponent } from './components/views/nft-svg/nft-svg.component';
import { ProjectsComponent } from './components/views/projects/projects.component';
import { TestViewComponent } from './components/views/test-view/test-view.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'projects/:userId',
    component: ProjectsComponent,
  },
  {
    path: 'layouts/project/:id',
    component: ComposerComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'layouts',
    component: ComposerComponent,
  },
  {
    path: 'nft-svg',
    component: NftSvgComponent,
  },
  {
    path: 'nft-html',
    component: NftHtmlComponent,
  },
  {
    path: 'test',
    component: TestViewComponent,
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
