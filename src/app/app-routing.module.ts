import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComposerComponent } from './components/views/composer/composer.component';
import { LoginComponent } from './components/views/login/login.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
