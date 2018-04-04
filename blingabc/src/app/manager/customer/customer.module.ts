import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
  CovalentPagingModule,
} from '@covalent/core';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatRadioModule,
  MatSelectModule, MatToolbarModule
} from '@angular/material';
import { Md2DatepickerModule } from '../../common/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerServiceManagerComponent } from './customer-service-manager.component';
import { ProblemRecordComponent } from './problem-record/problem-record.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { ShareModule } from '../share.module';
import { AddProblemRecordComponent } from './problem-record/add-problem-record/add-problem-record.component';
import { UpdateProblemRecordComponent } from './problem-record/update-problem-record/update-problem-record.component';
import { HandleProblemRecordComponent } from './problem-record/handle-problem-record/handle-problem-record.component';

const CUSTOMER_COMPONENT = [
  CustomerServiceManagerComponent,
  ProblemRecordComponent,
  AddProblemRecordComponent,
  UpdateProblemRecordComponent,
  HandleProblemRecordComponent,
];

const CUSTOMER_PROVIDERS = [
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
    MatRadioModule,
    Md2DatepickerModule,
    CustomerRoutingModule,
    ShareModule,
  ],
  declarations: [
    ...CUSTOMER_COMPONENT,
  ],
  providers: [
    ...CUSTOMER_PROVIDERS,
  ]
})
export class CustomerModule {
}
