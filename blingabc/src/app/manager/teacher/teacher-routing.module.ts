import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherManagerComponent } from './teacher-manager.component';
import { ClassTeacherComponent } from './class-teacher/class-teacher.component';
import { AddTeacherComponent } from './class-teacher/add-teacher/add-teacher.component';
import { UpdateTeacherComponent } from './class-teacher/update-teacher/update-teacher.component';
import { ForeignTeacherComponent } from './foreign-teacher/foreign-teacher.component';
import { AddForeignTeacherComponent } from './foreign-teacher/add-foreign-teacher/add-foreign-teacher.component';
import { UpdateForeignTeacherComponent } from './foreign-teacher/update-foreign-teacher/update-foreign-teacher.component';
import { LessonComponent } from './lesson/lesson.component';
import { FinanceComponent } from './finance/finance.component';
import { LogPageComponent } from './finance/log-page/log-page.component';

const routes: Routes = [
  {
    path: '', component: TeacherManagerComponent, children: [
      { path: '', redirectTo: 'class', pathMatch: 'full' },
      {
        path: 'class', children: [
          { path: '', component: ClassTeacherComponent, pathMatch: 'full' },
          { path: 'add', component: AddTeacherComponent },
          { path: 'detail/:id', component: UpdateTeacherComponent, },
        ]
      },
      {
        path: 'foreign', children: [
          { path: '', component: ForeignTeacherComponent, pathMatch: 'full' },
          { path: 'add', component: AddForeignTeacherComponent },
          { path: 'detail/:id', component: UpdateForeignTeacherComponent, },
        ]
      },
      { path: 'lesson', component: LessonComponent },
      {
        path: 'finance', children: [
          { path: '', component: FinanceComponent, pathMatch: 'full' },
          { path: 'log/:id', component: LogPageComponent, pathMatch: 'full' },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {
}
