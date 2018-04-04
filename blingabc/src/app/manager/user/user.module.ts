import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentMediaModule,
  CovalentPagingModule,
} from '@covalent/core';
import {
  MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule,
  MatMenuModule, MatRadioModule,
  MatSelectModule, MatToolbarModule
} from '@angular/material';
import {Md2DatepickerModule} from '../../common/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {UserRoutingModule} from './user-routing.module';
import {BatchImportComponent} from './batch-import/batch-import.component';
import {UserManagerComponent} from './user-manager.component';
import {ShareModule} from '../share.module';

const USER_COMPONENT = [
  UserManagerComponent,
  BatchImportComponent,
];

const USER_PROVIDERS = [
  CovalentLayoutModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CovalentCommonModule,
    CovalentDataTableModule,
    CovalentLayoutModule,
    CovalentPagingModule,
    CovalentMediaModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonToggleModule,
    Md2DatepickerModule,
    UserRoutingModule,
    ShareModule,
  ],
  declarations: [
    ...USER_COMPONENT,
  ],
  providers: [
    ...USER_PROVIDERS,
  ]
})
export class UserModule {
}
