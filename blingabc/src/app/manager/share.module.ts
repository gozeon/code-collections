import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindUserComponent } from './user/find-user/find-user.component';
import { UserInfoComponent } from './user/find-user/user-info/user-info.component';
import { OrderRecordComponent } from './user/find-user/order-record/order-record.component';
import { TrackRecordComponent } from './user/find-user/track-record/track-record.component';
import { ClassRecordComponent } from './user/find-user/class-record/class-record.component';
import {
  MatButtonModule, MatCardModule,
  MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatRadioModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentMediaModule,
  CovalentPagingModule
} from '@covalent/core';
import { AddOrderComponent } from './order/add-order/add-order.component';
import { Md2DatepickerModule } from '../common/datepicker/index';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { HomeworkRecordComponent } from './user/find-user/homework-record/homework-record.component';
import { FinishTheLessonComponent } from './user/find-user/finish-the-lesson/finish-the-lesson.component';
import { ToBeInClassComponent } from './user/find-user/to-be-in-class/to-be-in-class.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CovalentCommonModule,
    CovalentDataTableModule,
    CovalentLayoutModule,
    CovalentPagingModule,
    CovalentMediaModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatRadioModule,
    Md2DatepickerModule,
    NgxQRCodeModule,
  ],
  declarations: [
    FindUserComponent,
    UserInfoComponent,
    OrderRecordComponent,
    TrackRecordComponent,
    ClassRecordComponent,
    AddOrderComponent,
    ToBeInClassComponent,
    FinishTheLessonComponent,
    HomeworkRecordComponent
  ]
})
export class ShareModule {
}
