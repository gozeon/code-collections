import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
  CovalentPagingModule, CovalentSearchModule,
} from '@covalent/core';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { Md2DatepickerModule } from '../../common/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentRoutingModule } from './content-routing.module';
import { ContentManagerLessonComponent } from './lesson/lesson.component';
import { CTMLessonDetailComponent } from './lesson/lesson-detail/lesson-detail.component';
import { ContentManagerComponent } from './content-manager.component';
import { ContentManagerCourseComponent } from './course/course.component';
import { DragulaModule } from 'ng2-dragula';
import { QuillEditorModule } from '../../common/quill-editor/quillEditor.module';
import { PrepComponent } from './prep/prep.component';
import { HomeWorkComponent } from './home-work/home-work.component';
import { AddPrepComponent } from './prep/add-prep/add-prep.component';
import { UpdatePrepComponent } from './prep/update-prep/update-prep.component';
import { AddHomeworkComponent } from './home-work/add-homework/add-homework.component';
import { UpdateHomeworkComponent } from './home-work/update-homework/update-homework.component';
import { AddCourseComponent } from './course/add-course/add-course.component';
import { UpdateCourseComponent } from './course/update-course/update-course.component';
import { PracticeComponent } from './practice/practice.component';
import { AddPracticeComponent } from './practice/add-practice/add-practice.component';
import { UpdatePracticeComponent } from './practice/update-practice/update-practice.component';

const CONTENT_COMPONENT = [
  ContentManagerComponent,
  ContentManagerLessonComponent,
  CTMLessonDetailComponent,
  ContentManagerCourseComponent,
  PrepComponent,
  HomeWorkComponent,
  AddPrepComponent,
  UpdatePrepComponent,
  AddHomeworkComponent,
  UpdateHomeworkComponent,
  AddCourseComponent,
  UpdateCourseComponent,
  PracticeComponent,
  AddPracticeComponent,
  UpdatePracticeComponent,
];

const CONTENT_PROVIDERS = [
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
    MatRadioModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    Md2DatepickerModule,
    ContentRoutingModule,
    DragulaModule,
    QuillEditorModule,
  ],
  declarations: [
    ...CONTENT_COMPONENT,
  ],
  providers: [
    ...CONTENT_PROVIDERS,
  ]
})
export class ContentModule {
}
