import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';

const AUTH_COMPONENTS = [
  LoginComponent,
];

const routes: Routes = [
  { path: 'demo', loadChildren: 'app/demo.module#DemoModule' },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'demo', pathMatch: 'full' },
  { path: '**', redirectTo: 'demo' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [
    ...AUTH_COMPONENTS
  ]
})
export class AppRoutingModule { }
