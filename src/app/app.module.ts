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
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NftSvgComponent } from './components/views/nft-svg/nft-svg.component';
import { NftHtmlComponent } from './components/views/nft-html/nft-html.component';
import { SelectBatchComponent } from './components/modals/select-batch/select-batch.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfigureBarChartComponent } from './components/modals/configure-bar-chart/configure-bar-chart.component';
import { WidgetContentComponent } from './components/modals/widget-content/widget-content.component';
import { BarChartWidgetComponent } from './components/widgets/bar-chart-widget/bar-chart-widget.component';
import { PieChartWidgetComponent } from './components/widgets/pie-chart-widget/pie-chart-widget.component';
import { BarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ColorPickerModule } from 'ngx-color-picker';
import {
  MatNativeDateModule,
  MatRippleModule,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { nftReducer } from './store/nft-state-store/nft.reducer';
import { StoreModule } from '@ngrx/store';
import { MatTabsModule } from '@angular/material/tabs';
import { ConfigurePieChartComponent } from './components/modals/configure-pie-chart/configure-pie-chart.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LdaleditorComponent } from './components/editor/ldaleditor/ldaleditor.component';
import { TableComponent } from './components/widgets/table/table.component';
import { ConfigureTableComponent } from './components/modals/configure-table/configure-table.component';
import { MatBadgeModule } from '@angular/material/badge';
import { HttpClientModule } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { TestViewComponent } from 'src/app/components/views/test-view/test-view.component';
import { LoginComponent } from './components/views/login/login.component';
import { ProjectsComponent } from './components/views/projects/projects.component';
import { SelectMasterDataTypeComponent } from './components/modals/select-master-data-type/select-master-data-type.component';
import { SelectDataComponent } from './components/modals/select-data/select-data.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { NewProjectComponent } from './components/modals/new-project/new-project.component';
import { userReducer } from './store/user-state-store/user.reducer';
import { NgChartsModule } from 'ng2-charts';
import { TimelineViewComponent } from './components/modals/timeline-view/timeline-view.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProofbotViewComponent } from './components/modals/proofbot-view/proofbot-view.component';
import { HtmlCodebehindComponent } from './components/modals/html-codebehind/html-codebehind.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { SvgCodebehindComponent } from './components/modals/svg-codebehind/svg-codebehind.component';
import { DeleteProjectComponent } from './components/modals/delete-project/delete-project.component';
import { CloseProjectComponent } from './components/modals/close-project/close-project.component';
import { ImagePreviewComponent } from './components/modals/image-preview/image-preview.component';
import { DeleteWidgetComponent } from './components/modals/delete-widget/delete-widget.component';
import { FocusElementDirective } from './directives/focus-element.directive';
import { LayoutModule } from '@angular/cdk/layout';

const appRoutes: Routes = [];

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
    BarChartWidgetComponent,
    PieChartWidgetComponent,
    BarChartComponent,
    ConfigurePieChartComponent,
    LdaleditorComponent,
    TableComponent,
    ConfigureTableComponent,
    TestViewComponent,
    LoginComponent,
    ProjectsComponent,
    SelectMasterDataTypeComponent,
    SelectDataComponent,
    NewProjectComponent,
    TimelineViewComponent,
    ProofbotViewComponent,
    HtmlCodebehindComponent,
    SvgCodebehindComponent,
    DeleteProjectComponent,
    CloseProjectComponent,
    ImagePreviewComponent,
    DeleteWidgetComponent,
    FocusElementDirective,
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
    MatTableModule,
    MatBadgeModule,
    MatInputModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTooltipModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatRippleModule,
    ColorPickerModule,
    MatTabsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatStepperModule,
    MatButtonToggleModule,
    NgChartsModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot({ nft: nftReducer, user: userReducer }),
    HighlightModule,
    MatChipsModule,
    LayoutModule,
  ],
  providers: [
    CookieService,
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
        //lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
      },
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
