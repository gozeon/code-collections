import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagerComponent } from './user-manager.component';
import { BatchImportComponent } from './batch-import/batch-import.component';
import { FindUserComponent } from './find-user/find-user.component';
import { UserInfoComponent } from './find-user/user-info/user-info.component';
import { OrderRecordComponent } from './find-user/order-record/order-record.component';
import { TrackRecordComponent } from './find-user/track-record/track-record.component';
import { ClassRecordComponent } from './find-user/class-record/class-record.component';
import { ToBeInClassComponent } from './find-user/to-be-in-class/to-be-in-class.component';
import { FinishTheLessonComponent } from './find-user/finish-the-lesson/finish-the-lesson.component';
import { HomeworkRecordComponent } from './find-user/homework-record/homework-record.component';

const routes: Routes = [
  {
    path: '', component: UserManagerComponent, children: [
    {path: '', redirectTo: 'import', pathMatch: 'full'},
    {
      path: 'import', children: [
      {path: '', component: BatchImportComponent, pathMatch: 'full'},
    ]
    },
    {
      path: 'add', component: FindUserComponent, children: [
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
export class UserRoutingModule {
}
