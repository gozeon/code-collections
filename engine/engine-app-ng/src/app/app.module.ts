import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { LoginService } from './services/login.service';

import { AppComponent } from './app.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { HandleComponent } from './components/common/handle/handle.component';
import { DirectoryComponent } from './components/directory/directory.component';
import { EditorComponent } from './components/editor/editor.component';
import { InspectComponent } from './components/inspect/inspect.component';
import { MapComponent } from './components/map/map.component';
import { TreeComponent } from './components/common/tree/tree.component';
import { LoginComponent } from './components/login/login.component';

// import { TreeModule } from 'angular-tree-component';
// import { TreeModule } from 'ng2-tree';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'playground', component: PlaygroundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundComponent,
    HandleComponent,
    DirectoryComponent,
    EditorComponent,
    InspectComponent,
    MapComponent,
    TreeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
