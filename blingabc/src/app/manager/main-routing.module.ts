import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContentGuard } from '../guard/content.guard';

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', component: DashboardComponent },
      { path: 'interactive', loadChildren: './interactive/interactive.module#InteractiveModule' },
      { path: 'recruitment', loadChildren: './recruitment/recruitment.module#RecruitmentModule' },
      { path: 'conference', loadChildren: './conference/conference.module#ConferenceModule' },
      { path: 'teacher', loadChildren: './teacher/teacher.module#TeacherModule' },
      { path: 'content', loadChildren: './content/content.module#ContentModule', canActivate: [ContentGuard], },
      { path: 'authority', loadChildren: './authority/authority.module#AuthorityModule' },
      { path: 'user', loadChildren: './user/user.module#UserModule' },
      { path: 'class', loadChildren: './class/class.module#ClassModule' },
      { path: 'message', loadChildren: './message/message.module#MessageModule' },
      { path: 'customer', loadChildren: './customer/customer.module#CustomerModule' },
      { path: 'sales', loadChildren: './sales/sales.module#SalesModule' },
      { path: 'student', loadChildren: './student/student.module#StudentModule' },
      { path: 'order', loadChildren: './order/order.module#OrderModule' },
      { path: 'distribution', loadChildren: './distribution/distribution.module#DistributionModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
