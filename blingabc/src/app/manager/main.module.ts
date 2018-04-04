import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule,
  CovalentLoadingModule
} from '@covalent/core';
import { MatButtonModule, MatCardModule, MatIconModule, MatListModule, MatMenuModule } from '@angular/material';

const MAIN_COMPONENT = [
  MainComponent,
  DashboardComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    CovalentLayoutModule,
    CovalentCommonModule,
    CovalentDataTableModule,
    CovalentLoadingModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
  ],
  declarations: [
    ...MAIN_COMPONENT
  ]
})
export class MainModule {
}
