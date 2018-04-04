import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DependModule } from './depend.module';
import { AppRoutingModule } from './app-routing.module';
import { ServiceModule } from './services/service.module';
import { DialogModule } from './dialog/dialog.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer/index';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

const APP_MODULE = [
  AppRoutingModule,
  DependModule,
  ServiceModule,
  DialogModule,
  HttpClientModule,
  StoreModule.forRoot(reducer),
  StoreDevtoolsModule.instrument({
    maxAge: 25
  })
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ...APP_MODULE
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
