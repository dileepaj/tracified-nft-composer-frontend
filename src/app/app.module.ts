import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArtifactsComponent } from './components/artifacts/artifacts.component';
import { LoginComponent } from './components/login/login.component';
import { ComposerComponent } from './components/composer/composer.component';
import { NftfileComponent } from './components/nftfile/nftfile.component';
import { ContentComponent } from './components/content/content.component';
import { TracabilityDataComponent } from './components/tracability-data/tracability-data.component';
@NgModule({
  declarations: [
    AppComponent,
    ArtifactsComponent,
    LoginComponent,
    ComposerComponent,
    NftfileComponent,
    ContentComponent,
    TracabilityDataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
