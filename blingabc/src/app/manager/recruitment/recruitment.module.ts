import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentLoadingModule,
  CovalentPagingModule, TdLayoutManageListToggleDirective,
} from '@covalent/core';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule, MatToolbarModule
} from '@angular/material';
import {Md2DatepickerModule} from '../../common/datepicker';
import {RecruitmentRoutingModule} from './recruitment-routing.module';
import {RecruitmentManagerComponent} from './recruitment-manager.component';
import {ApplicationProcessComponent} from './application-process/application-process.component';
import {ProcessTeacherDetailComponent} from './application-process/process-teacher-detail/process-teacher-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ProcessTeacherLaunchComponent} from './application-process/process-teacher-launch/process-teacher-launch.component';

const RECRUITMENT_COMPONENT = [
  RecruitmentManagerComponent,
  ApplicationProcessComponent,
  ProcessTeacherDetailComponent,
  ProcessTeacherLaunchComponent,
];

const RECRUITMENT_PROVIDERS = [
  CovalentLayoutModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RecruitmentRoutingModule,
    CovalentCommonModule,
    CovalentDataTableModule,
    CovalentLayoutModule,
    CovalentPagingModule,
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
    MatProgressSpinnerModule,
  ],
  declarations: [
    ...RECRUITMENT_COMPONENT
  ],
  providers: [
    ...RECRUITMENT_PROVIDERS,
  ]
})
export class RecruitmentModule {
}
