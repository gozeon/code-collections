import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { App1ShareMoudle } from '../../projects/app1/src/app/app.module';
import { App2ShareMoudle } from '../../projects/app2/src/app/app.module';

const routes: Routes = [
  { path: 'app1', loadChildren: '../../projects/app1/src/app/app.module#App1ShareMoudle'},
  { path: 'app2', loadChildren: '../../projects/app2/src/app/app.module#App2ShareMoudle'},
  { path: '**', redirectTo: '/app1/one' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    App1ShareMoudle.forRoot(),
    App2ShareMoudle.forRoot()
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
