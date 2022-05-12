import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/views/login/login.component';
import { NftHtmlComponent } from './components/views/nft-html/nft-html.component';
import { NftSvgComponent } from './components/views/nft-svg/nft-svg.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'layout',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/composer/composer.module').then(
        (m) => m.ComposerModule
      ), //lazy loading
  },
  {
    path: 'nft-html',
    component: NftHtmlComponent,
  },
  {
    path: 'nft-svg',
    component: NftSvgComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
