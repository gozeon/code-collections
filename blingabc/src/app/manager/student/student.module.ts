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
import { StudentManagerComponent } from './student-manager.component';
import { StudentRoutingModule } from './stduent-routing.module';
import { ShareModule } from '../share.module';
import { StudentClassComponent } from './student-class/student-class.component';
import { StudentLessonComponent } from './student-lesson/student-lesson.component';

const STUDENT_COMPONENT = [
  StudentManagerComponent,
  StudentClassComponent,
  StudentLessonComponent
];

const STUDENT_PROVIDERS = [
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
    StudentRoutingModule,
    ShareModule,
  ],
  declarations: [
    ...STUDENT_COMPONENT,
  ],
  providers: [
    ...STUDENT_PROVIDERS,
  ]
})
export class StudentModule {
}
