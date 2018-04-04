import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MessageManagerComponent} from './message-manager.component';
import {MsgTemplateComponent} from './msg-template/msg-template.component';
import {AddTmpComponent} from './msg-template/add-tmp/add-tmp.component';
import {MsgTemplateDetailComponent} from './msg-template-detail/msg-template-detail.component';
import {MsgHistoryComponent} from './msg-history/msg-history.component';

const routes: Routes = [
  {
    path: '', component: MessageManagerComponent, children: [
    {path: '', redirectTo: 'template', pathMatch: 'full'},
    {
      path: 'template', children: [
      {path: '', component: MsgTemplateComponent, pathMatch: 'full'},
      {path: 'add', component: AddTmpComponent, pathMatch: 'full'},
    ]
    },
    {
      path: 'templateDetail', children: [
      {path: '', component: MsgTemplateDetailComponent, pathMatch: 'full'},
    ]
    },
    {
      path: 'history', children: [
      {path: '', component: MsgHistoryComponent, pathMatch: 'full'},
    ]
    },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageRoutingModule {
}
