import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesManagerComponent } from './sales-manager.component';
import { TrackUserComponent } from './track-user/track-user.component';
import { FindUserComponent } from '../user/find-user/find-user.component';
import { UserInfoComponent } from '../user/find-user/user-info/user-info.component';
import { OrderRecordComponent } from '../user/find-user/order-record/order-record.component';
import { ClassRecordComponent } from '../user/find-user/class-record/class-record.component';
import { TrackRecordComponent } from '../user/find-user/track-record/track-record.component';
import { ToBeInClassComponent } from '../user/find-user/to-be-in-class/to-be-in-class.component';
import { FinishTheLessonComponent } from '../user/find-user/finish-the-lesson/finish-the-lesson.component';
import { HomeworkRecordComponent } from '../user/find-user/homework-record/homework-record.component';
import { NewStudentComponent } from './new-student/new-student.component';

const routes: Routes = [
  {
    path: '', component: SalesManagerComponent, children: [
      {path: '', redirectTo: 'tracking', pathMatch: 'full'},
      {
        path: 'new-student', children: [
          {path: '', component: NewStudentComponent, pathMatch: 'full'}
        ]
      },
      {
        path: 'tracking', children: [
          {path: '', component: TrackUserComponent, pathMatch: 'full'},
          {
            path: 'user', component: FindUserComponent, children: [
              {path: 'user-info', component: UserInfoComponent, data: {back: 'sales'}},
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
export class SalesRoutingModule {
}
