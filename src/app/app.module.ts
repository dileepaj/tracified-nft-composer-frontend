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
import { MatToolbarModule } from '@angular/material/toolbar';
import { NftSvgComponent } from './components/views/nft-svg/nft-svg.component';
import { NftHtmlComponent } from './components/views/nft-html/nft-html.component';
import { SelectBatchComponent } from './components/modals/select-batch/select-batch.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfigureBarChartComponent } from './components/modals/configure-bar-chart/configure-bar-chart.component';
import { WidgetContentComponent } from './components/modals/widget-content/widget-content.component';
import { BubbleChartWidgetComponent } from './components/widgets/bubble-chart-widget/bubble-chart-widget.component';
import { BarChartWidgetComponent } from './components/widgets/bar-chart-widget/bar-chart-widget.component';
import { PieChartWidgetComponent } from './components/widgets/pie-chart-widget/pie-chart-widget.component';
import { BarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatRippleModule } from '@angular/material/core';
import { nftReducer } from './store/nft-state-store/nft.reducer';
import { StoreModule } from '@ngrx/store';
import { MatTabsModule } from '@angular/material/tabs';
import { ConfigurePieChartComponent } from './components/modals/configure-pie-chart/configure-pie-chart.component';
import { FlexLayoutModule } from '@angular/flex-layout';

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
    SelectBatchComponent,

    ConfigureBarChartComponent,
    WidgetContentComponent,
    BubbleChartWidgetComponent,
    BarChartWidgetComponent,
    PieChartWidgetComponent,
    BarChartComponent,
    ConfigurePieChartComponent,
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
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatRippleModule,
    ColorPickerModule,
    MatTabsModule,
    FlexLayoutModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot({ nft: nftReducer }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
