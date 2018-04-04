import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectLessonComponent } from './select-lesson/select-lesson.component';
import { SelectTeacherComponent } from './select-teacher/select-teacher.component';
import { OpenClassToComponent } from './open-class-to/open-class-to.component';
import { SelectClassTeacherComponent } from './select-class-teacher/select-class-teacher.component';
import { SelectCourseComponent } from './select-course/select-course.component';
import { OrderCheckedComponent } from './order-checked/order-checked.component';
import { ViewCourseTimeComponent } from './view-course-time/view-course-time.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { ChangeClassTeacherComponent } from './change-class-teacher/change-class-teacher.component';
import { UpdateLogComponent } from './update-log/update-log.component';
import { SelectOrderClassComponent } from './select-order-class/select-order-class.component';
import { ViewImageComponent } from './view-image/view-image.component';
import { AddConferenceComponent } from './add-conference/add-conference.component';
import { AddCrmUserComponent } from './add-crm-user/add-crm-user.component';
import { ChangeForeignTeacherComponent } from './change-foreign-teacher/change-foreign-teacher.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UpdateResumeStatusComponent } from './update-resume-status/update-resume-status.component';
import {
  CovalentDataTableModule, CovalentLayoutModule, CovalentLoadingModule, CovalentPagingModule,
  CovalentSearchModule
} from '@covalent/core';
import {
  MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatExpansionModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule, MatListModule, MatRadioModule,
  MatSelectModule, MatTabsModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Md2DatepickerModule } from '../common/datepicker';
import { SetTrackTimeComponent } from './set-track-time/set-track-time.component';
import { ShowTrackContentComponent } from './show-track-content/show-track-content.component';
import { CreateTrackRecordComponent } from './create-track-record/create-track-record.component';
import { RecedeClassComponent } from './recede-class/recede-class.component';
import { TransferClassComponent } from './transfer-class/transfer-class.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { ForeignMarkAbsentComponent } from './foreign-mark-absent/foreign-mark-absent.component';
import { FinanceInsertComponent } from './finance-insert/finance-insert.component';
import { SelectPrepComponent } from './select-prep/select-prep.component';
import { SelectHomeworkComponent } from './select-homework/select-homework.component';
import { PrepPreviewComponent } from './prep-preview/prep-preview.component';
import { HomeworkPreviewComponent } from './homework-preview/homework-preview.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { SelectPracticeComponent } from './select-practice/select-practice.component';
import { PeriodComponent } from './period/period.component';
import { ForeignTeacherCommentComponent } from './foreign-teacher-comment/foreign-teacher-comment.component';
import { StudentHomeworkPreviewComponent } from './student-homework-preview/student-homework-preview.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { UpdateProblemRecordComponent } from './update-problem-record/update-problem-record.component';
import { ProblemRecordDetailPreviewComponent } from './problem-record-detail-preview/problem-record-detail-preview.component';
import { DistributionTeacherAccountPreviewComponent } from './distribution-teacher-account-preview/distribution-teacher-account-preview.component';
import { CheckQuiteClassAccountComponent } from './check-quite-class-account/check-quite-class-account.component';

const DIALOG_COMPONENT = [
  SelectLessonComponent,
  SelectTeacherComponent,
  OpenClassToComponent,
  SelectClassTeacherComponent,
  SelectCourseComponent,
  OrderCheckedComponent,
  ViewCourseTimeComponent,
  AddAddressComponent,
  ChangeClassTeacherComponent,
  UpdateLogComponent,
  SelectOrderClassComponent,
  ViewImageComponent,
  AddConferenceComponent,
  AddCrmUserComponent,
  ChangeForeignTeacherComponent,
  CreateUserComponent,
  UpdateResumeStatusComponent,
  SetTrackTimeComponent,
  ShowTrackContentComponent,
  CreateTrackRecordComponent,
  RecedeClassComponent,
  TransferClassComponent,
  SendMessageComponent,
  ForeignMarkAbsentComponent,
  FinanceInsertComponent,
  SelectPrepComponent,
  SelectHomeworkComponent,
  PrepPreviewComponent,
  HomeworkPreviewComponent,
  SelectPracticeComponent,
  PeriodComponent,
  ForeignTeacherCommentComponent,
  StudentHomeworkPreviewComponent,
  QrcodeComponent,
  UpdateProblemRecordComponent,
  ProblemRecordDetailPreviewComponent,
  DistributionTeacherAccountPreviewComponent,
  CheckQuiteClassAccountComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CovalentLayoutModule,
    CovalentPagingModule,
    CovalentDataTableModule,
    CovalentSearchModule,
    CovalentLoadingModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    Md2DatepickerModule,
    MatTabsModule,
    NgxQRCodeModule,
  ],
  declarations: [
    ...DIALOG_COMPONENT,
  ],
  entryComponents: [
    ...DIALOG_COMPONENT
  ],
})
export class DialogModule {
}
