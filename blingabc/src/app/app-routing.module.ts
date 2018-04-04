import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {CovalentLayoutModule} from '@covalent/core';

import {LoginComponent} from './login/login.component';

import {NotFoundComponent} from './manager/not-found/not-found.component';

import {LoggedInGuard} from './guard/loggedIn.guard';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

const AUTH_COMPONENT = [
  LoginComponent,
  NotFoundComponent,
];

const routes: Routes = [
  {
    path: 'main',
    loadChildren: 'app/manager/main.module#MainModule',
    canActivate: [LoggedInGuard],
  },
  {path: 'login', component: LoginComponent},
  {path: '404', component: NotFoundComponent},
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {path: '**', redirectTo: '404'},
];

@NgModule({
  imports: [
    CommonModule,
    CovalentLayoutModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forRoot(routes, {
      useHash: false,
      preloadingStrategy: PreloadAllModules
    }),
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    ...AUTH_COMPONENT
  ]
})
export class AppRoutingModule {
}

