import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RecruitmentManagerComponent} from './recruitment-manager.component';
import {ApplicationProcessComponent} from './application-process/application-process.component';
import {ProcessTeacherDetailComponent} from './application-process/process-teacher-detail/process-teacher-detail.component';
import {ProcessTeacherLaunchComponent} from './application-process/process-teacher-launch/process-teacher-launch.component';


const routes: Routes = [
  {
    path: '', component: RecruitmentManagerComponent, children: [
    {path: '', redirectTo: 'process', pathMatch: 'full'},
    {path: 'process', component: ApplicationProcessComponent},
    {path: 'detail/:id', component: ProcessTeacherDetailComponent},
    {path: 'launch/:id', component: ProcessTeacherLaunchComponent},
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentRoutingModule {
}
