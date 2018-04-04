///<reference path='class-msg-tpl/class-msg-tpl-detial/class-msg-tpl-detial.component.ts'/>
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CovalentChipsModule,
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
  CovalentPagingModule, CovalentSearchModule,
} from '@covalent/core';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatRadioModule,
  MatSelectModule, MatToolbarModule
} from '@angular/material';
import {Md2DatepickerModule} from './../../common/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ClassRoutingModule} from './class-routing.module';
import {ClassManagerComponent} from './class-manager.component';
import {ClassListComponent} from './class-list/class-list.component';
import {ClassMsgTplDetialComponent} from './class-msg-tpl/class-msg-tpl-detial/class-msg-tpl-detial.component';
import {ClassMsgTplComponent} from './class-msg-tpl/class-msg-tpl.component';
import {TmpOpenClassComponent} from './class-msg-tpl/tmp-open-class/tmp-open-class.component';
import {ClassDetialComponent} from './class-list/class-detial/class-detial.component';
import {ClassTimeComponent} from './class-time/class-time.component';

const CLASS_COMPONENT = [
  ClassManagerComponent,
  ClassListComponent,
  ClassDetialComponent,
  ClassMsgTplComponent,
  ClassMsgTplDetialComponent,
  TmpOpenClassComponent,
  ClassTimeComponent,
];

const CLASS_PROVIDERS = [
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
    CovalentChipsModule,
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
    ClassRoutingModule,
  ],
  declarations: [
    ...CLASS_COMPONENT
  ],
  providers: [
    ...CLASS_PROVIDERS,
  ]
})
export class ClassModule {
}
