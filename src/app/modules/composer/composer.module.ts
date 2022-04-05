import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComposerRoutingModule } from './composer-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    ComposerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ComposerModule {}
