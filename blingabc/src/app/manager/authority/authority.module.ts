import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
  CovalentPagingModule, CovalentSearchModule,
} from '@covalent/core';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatRadioModule,
  MatSelectModule, MatToolbarModule
} from '@angular/material';
import {Md2DatepickerModule} from '../../common/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AuthorityManagerComponent} from './authority-manager.component';
import {StaffGroupComponent} from './staff-group/staff-group.component';
import {SettingComponent} from './setting/setting.component';
import {AuthorityRoutingModule} from './authority-routing.module';

const AUTHORITY_COMPONENT = [
  AuthorityManagerComponent,
  StaffGroupComponent,
  SettingComponent,
];

const AUTHORITY_PROVIDERS = [
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
    CovalentSearchModule,
    CovalentLoadingModule,
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
    Md2DatepickerModule,
    AuthorityRoutingModule,
  ],
  declarations: [
    ...AUTHORITY_COMPONENT
  ],
  providers: [
    ...AUTHORITY_PROVIDERS,
  ]
})
export class AuthorityModule {
}
