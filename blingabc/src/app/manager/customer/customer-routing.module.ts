import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerServiceManagerComponent } from './customer-service-manager.component';
import { ProblemRecordComponent } from './problem-record/problem-record.component';
import { FindUserComponent } from '../user/find-user/find-user.component';
import { UserInfoComponent } from '../user/find-user/user-info/user-info.component';
import { OrderRecordComponent } from '../user/find-user/order-record/order-record.component';
import { TrackRecordComponent } from '../user/find-user/track-record/track-record.component';
import { ClassRecordComponent } from '../user/find-user/class-record/class-record.component';
import { AddOrderComponent } from '../order/add-order/add-order.component';
import { ToBeInClassComponent } from '../user/find-user/to-be-in-class/to-be-in-class.component';
import { FinishTheLessonComponent } from '../user/find-user/finish-the-lesson/finish-the-lesson.component';
import { HomeworkRecordComponent } from '../user/find-user/homework-record/homework-record.component';
import { AddProblemRecordComponent } from './problem-record/add-problem-record/add-problem-record.component';
import { UpdateProblemRecordComponent } from './problem-record/update-problem-record/update-problem-record.component';
import { HandleProblemRecordComponent } from './problem-record/handle-problem-record/handle-problem-record.component';

const routes: Routes = [
  {
    path: '', component: CustomerServiceManagerComponent, children: [
      {path: '', redirectTo: 'problem', pathMatch: 'full'},
      {
        path: 'problem', children: [
          {path: '', component: ProblemRecordComponent, pathMatch: 'full'},
          {path: 'add', component: AddProblemRecordComponent, pathMatch: 'full'},
          {path: 'detail/:id', component: UpdateProblemRecordComponent, pathMatch: 'full'},
          {path: 'handle/:id', component: HandleProblemRecordComponent, pathMatch: 'full'},
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
      {
        path: 'order', component: AddOrderComponent, pathMatch: 'full'
        //   { path: '', component: AddOrderComponent, pathMatch: 'full' },
        // ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {
}
