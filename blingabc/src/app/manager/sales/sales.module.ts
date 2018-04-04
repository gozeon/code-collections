import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
  CovalentPagingModule, CovalentSearchModule,
} from '@covalent/core';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatRadioModule,
  MatSelectModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {Md2DatepickerModule} from '../../common/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SalesRoutingModule} from './sales-routing.module';
import {SalesManagerComponent} from './sales-manager.component';
import {TrackUserComponent} from './track-user/track-user.component';
import {ShareModule} from '../share.module';
import { NewStudentComponent } from './new-student/new-student.component';

const SALES_COMPONENT = [
  SalesManagerComponent,
  TrackUserComponent,
  NewStudentComponent,
];

const SALES_PROVIDERS = [
  CovalentLayoutModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CovalentCommonModule,
    CovalentDataTableModule,
    CovalentLayoutModule,
    CovalentPagingModule,
    CovalentMediaModule,
    CovalentSearchModule,
    CovalentLoadingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatRadioModule,
    Md2DatepickerModule,
    SalesRoutingModule,
    ShareModule,
  ],
  declarations: [
    ...SALES_COMPONENT,
  ],
  providers: [
    ...SALES_PROVIDERS,
  ]
})
export class SalesModule {
}
