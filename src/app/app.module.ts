import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComposerComponent } from './components/views/composer/composer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/shared/header/header.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { WidgetsPaneComponent } from './components/widgets/widgets-pane/widgets-pane.component';
import { NftImageComponent } from './components/widgets/nft-image/nft-image.component';
import { NftTimelineComponent } from './components/widgets/nft-timeline/nft-timeline.component';
import { NftProofbotComponent } from './components/widgets/nft-proofbot/nft-proofbot.component';
import { NftCarbonfootprintComponent } from './components/widgets/nft-carbonfootprint/nft-carbonfootprint.component';
import { NftStatisticsComponent } from './components/widgets/nft-statistics/nft-statistics.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';
import { NftSvgComponent } from './components/views/nft-svg/nft-svg.component';
import { NftHtmlComponent } from './components/views/nft-html/nft-html.component';

const appRoutes: Routes = [
  {
    path: 'composer',
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
];

@NgModule({
  declarations: [
    AppComponent,
    ComposerComponent,
    HeaderComponent,
    SidebarComponent,
    WidgetsPaneComponent,
    NftImageComponent,
    NftTimelineComponent,
    NftProofbotComponent,
    NftCarbonfootprintComponent,
    NftStatisticsComponent,
    NftSvgComponent,
    NftHtmlComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    DragDropModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatMenuModule,
    MatTreeModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
