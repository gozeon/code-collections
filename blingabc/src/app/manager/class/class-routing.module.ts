///<reference path='class-msg-tpl/class-msg-tpl-detial/class-msg-tpl-detial.component.ts'/>
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClassManagerComponent} from './class-manager.component';
import {ClassListComponent} from './class-list/class-list.component';
import {ClassDetialComponent} from './class-list/class-detial/class-detial.component';
import {ClassMsgTplComponent} from './class-msg-tpl/class-msg-tpl.component';
import {ClassMsgTplDetialComponent} from './class-msg-tpl/class-msg-tpl-detial/class-msg-tpl-detial.component';
import {TmpOpenClassComponent} from './class-msg-tpl/tmp-open-class/tmp-open-class.component';
import {ClassTimeComponent} from './class-time/class-time.component';

const routes: Routes = [
  {
    path: '', component: ClassManagerComponent, children: [
    { path: '', redirectTo: 'template', pathMatch: 'full' },
    {
      path: 'list', children: [
      { path: '', component: ClassListComponent, pathMatch: 'full' },
      { path: 'detail/:id', component: ClassDetialComponent, pathMatch: 'full' },
    ]
    },
    {
      path: 'template', children: [
      { path: '', component: ClassMsgTplComponent, pathMatch: 'full' },
      { path: 'detail/:id', component: ClassMsgTplDetialComponent, },
      { path: 'add', component: ClassMsgTplDetialComponent, },
      { path: 'create/:id', component: TmpOpenClassComponent, },
    ]
    },
    {
      path: 'class_time', children: [
      { path: '', component: ClassTimeComponent, pathMatch: 'full' },
    ]
    },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassRoutingModule {
}
