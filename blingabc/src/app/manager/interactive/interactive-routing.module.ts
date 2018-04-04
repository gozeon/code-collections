import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LearnRecordComponent} from './learn-record/learn-record.component';
import {InteractiveManagerComponent} from './interactive-manager.component';

const routes: Routes = [
  {
    path: '', component: InteractiveManagerComponent, children: [
    {path: '', redirectTo: 'record', pathMatch: 'full'},
    {path: 'record', component: LearnRecordComponent}
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InteractiveRoutingModule {
}
