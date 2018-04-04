import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
  CovalentPagingModule,
} from '@covalent/core';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule,
  MatListModule,
  MatMenuModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule, MatTabsModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Md2DatepickerModule } from '../../common/datepicker';
import { DistributionRoutingModule } from './distribution-routing.module';
import { DistributionManagerComponent } from './distribution-manager.component';
import { DistributionTeacherComponent } from './distribution-teacher/distribution-teacher.component';
import { DistributionCommissionComponent } from './distribution-commission/distribution-commission.component';
import { DistributionWithdrawComponent } from './distribution-withdraw/distribution-withdraw.component';
import { DistributionWithdrawProhibitedComponent } from './distribution-withdraw-prohibited/distribution-withdraw-prohibited.component';
import { AddDistributionTeacherComponent } from './distribution-teacher/add-distribution-teacher/add-distribution-teacher.component';
import { AddDistributionWithdrawProhibitedComponent } from './distribution-withdraw-prohibited/add-distribution-withdraw-prohibited/add-distribution-withdraw-prohibited.component';

const DISTRIBUTION_COMPONENT = [
  DistributionManagerComponent,
  DistributionTeacherComponent,
  DistributionCommissionComponent,
  DistributionWithdrawComponent,
  DistributionWithdrawProhibitedComponent,
];

const DISTRIBUTION_PROVIDERS = [
  CovalentLayoutModule,
  MatDialogModule,
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
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    Md2DatepickerModule,
    DistributionRoutingModule,
  ],
  declarations: [
    ...DISTRIBUTION_COMPONENT,
    AddDistributionTeacherComponent,
    AddDistributionWithdrawProhibitedComponent,
  ],
  providers: [
    ...DISTRIBUTION_PROVIDERS,
  ],
})
export class DistributionModule {
}
