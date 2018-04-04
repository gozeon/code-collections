import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentManagerComponent } from './content-manager.component';
import { ContentManagerLessonComponent } from './lesson/lesson.component';
import { CTMLessonDetailComponent } from './lesson/lesson-detail/lesson-detail.component';
import { ContentManagerCourseComponent } from './course/course.component';
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

const routes: Routes = [
  {
    path: '', component: ContentManagerComponent, children: [
    {path: '', redirectTo: 'lesson', pathMatch: 'full'},
    {
      path: 'lesson', children: [
      {path: '', component: ContentManagerLessonComponent, pathMatch: 'full'},
      {path: 'add', component: CTMLessonDetailComponent},
      {path: 'detail/:id', component: CTMLessonDetailComponent},
    ]
    },
    {
      path: 'course', children: [
      {path: '', component: ContentManagerCourseComponent, pathMatch: 'full'},
      {path: 'add', component: AddCourseComponent},
      {path: 'detail/:id', component: UpdateCourseComponent},
    ]
    },
    {
      path: 'prep', children: [
      {path: '', component: PrepComponent, pathMatch: 'full'},
      {path: 'add', component: AddPrepComponent},
      {path: 'detail/:id', component: UpdatePrepComponent},
    ]
    },
    {
      path: 'homework', children: [
      {path: '', component: HomeWorkComponent, pathMatch: 'full'},
      {path: 'add', component: AddHomeworkComponent},
      {path: 'detail/:id', component: UpdateHomeworkComponent},
    ]
    },
    {
      path: 'practice', children: [
      {path: '', component: PracticeComponent, pathMatch: 'full'},
      {path: 'add', component: AddPracticeComponent},
      {path: 'detail/:id', component: UpdatePracticeComponent},
    ]
    },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule {
}
