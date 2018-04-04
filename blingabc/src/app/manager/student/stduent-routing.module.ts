import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentManagerComponent } from './student-manager.component';
import { FindUserComponent } from '../user/find-user/find-user.component';
import { UserInfoComponent } from '../user/find-user/user-info/user-info.component';
import { OrderRecordComponent } from '../user/find-user/order-record/order-record.component';
import { TrackRecordComponent } from '../user/find-user/track-record/track-record.component';
import { ClassRecordComponent } from '../user/find-user/class-record/class-record.component';
import { StudentClassComponent } from './student-class/student-class.component';
import { StudentLessonComponent } from './student-lesson/student-lesson.component';
import { ToBeInClassComponent } from '../user/find-user/to-be-in-class/to-be-in-class.component';
import { FinishTheLessonComponent } from '../user/find-user/finish-the-lesson/finish-the-lesson.component';
import { HomeworkRecordComponent } from '../user/find-user/homework-record/homework-record.component';

const routes: Routes = [
  {
    path: '', component: StudentManagerComponent, children: [
    {path: '', redirectTo: 'class', pathMatch: 'full'},
    {
      path: 'class', children: [
      {path: '', component: StudentClassComponent, pathMatch: 'full'},
    ]
    },
    {
      path: 'lesson', children: [
      {path: '', component: StudentLessonComponent, pathMatch: 'full'},
    ]
    },
    {
      path: 'user', component: FindUserComponent, children: [
      {path: '', redirectTo: 'user-info', pathMatch: 'full'},
      {path: 'user-info', component: UserInfoComponent},
      {path: 'order-record', component: OrderRecordComponent},
      {path: 'track-record', component: TrackRecordComponent},
      {path: 'class-record', component: ClassRecordComponent},
      {path: 'to-be-in-class', component: ToBeInClassComponent},
      {path: 'finish-the-lesson', component: FinishTheLessonComponent},
      {path: 'homework-record', component: HomeworkRecordComponent},
    ]
    },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {
}
