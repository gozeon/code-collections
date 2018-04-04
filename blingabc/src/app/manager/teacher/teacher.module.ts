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
import {Md2DatepickerModule} from '../../common/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TeacherManagerComponent} from './teacher-manager.component';
import {ClassTeacherComponent} from './class-teacher/class-teacher.component';
import {AddTeacherComponent} from './class-teacher/add-teacher/add-teacher.component';
import {UpdateTeacherComponent} from './class-teacher/update-teacher/update-teacher.component';
import {ForeignTeacherComponent} from './foreign-teacher/foreign-teacher.component';
import {AddForeignTeacherComponent} from './foreign-teacher/add-foreign-teacher/add-foreign-teacher.component';
import {UpdateForeignTeacherComponent} from './foreign-teacher/update-foreign-teacher/update-foreign-teacher.component';
import {TeacherRoutingModule} from './teacher-routing.module';
import {DialogModule} from '../../dialog/dialog.module';
import {ViewImageComponent} from '../../dialog/view-image/view-image.component';
import { FinanceComponent } from './finance/finance.component';
import { LessonComponent } from './lesson/lesson.component';
import { LogPageComponent } from './finance/log-page/log-page.component';

const TEACHER_COMPONENT = [
  TeacherManagerComponent,
  ClassTeacherComponent,
  AddTeacherComponent,
  UpdateTeacherComponent,
  ForeignTeacherComponent,
  AddForeignTeacherComponent,
  UpdateForeignTeacherComponent,
  FinanceComponent,
  LessonComponent,
  LogPageComponent,
];

const TEACHER_PROVIDERS = [
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
    TeacherRoutingModule,
  ],
  declarations: [
    ...TEACHER_COMPONENT,
  ],
  providers: [
    ...TEACHER_PROVIDERS,
  ],
})
export class TeacherModule {
}
