import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentLoadingModule,
  CovalentPagingModule,
} from '@covalent/core';
import {
  MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule,
  MatSelectModule, MatToolbarModule
} from '@angular/material';
import {InteractiveRoutingModule} from './interactive-routing.module';
import {LearnRecordComponent} from './learn-record/learn-record.component';
import {Md2DatepickerModule} from '../../common/datepicker';
import {InteractiveManagerComponent} from './interactive-manager.component';

const INTERACTIVE_COMPONENT = [
  LearnRecordComponent,
  InteractiveManagerComponent,
];

const INTERACTIVE_PROVIDERS = [
  CovalentLayoutModule,
];

@NgModule({
  imports: [
    CommonModule,
    InteractiveRoutingModule,
    CovalentCommonModule,
    CovalentDataTableModule,
    CovalentLayoutModule,
    CovalentPagingModule,
    CovalentLoadingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    Md2DatepickerModule,
  ],
  declarations: [
    ...INTERACTIVE_COMPONENT
  ],
  providers: [
    ...INTERACTIVE_PROVIDERS,
  ]
})
export class InteractiveModule {
}
