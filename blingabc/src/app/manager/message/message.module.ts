import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
  CovalentPagingModule,
} from '@covalent/core';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatRadioModule,
  MatSelectModule, MatToolbarModule
} from '@angular/material';
import {Md2DatepickerModule} from '../../common/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MessageManagerComponent} from './message-manager.component';
import {MsgTemplateComponent} from './msg-template/msg-template.component';
import {AddTmpComponent} from './msg-template/add-tmp/add-tmp.component';
import {MsgTemplateDetailComponent} from './msg-template-detail/msg-template-detail.component';
import {MsgHistoryComponent} from './msg-history/msg-history.component';
import {MessageRoutingModule} from "./message-routing.module";
import {CovalentDynamicFormsModule} from "@covalent/dynamic-forms";

const MESSAGE_COMPONENT = [
  MessageManagerComponent,
  MsgTemplateComponent,
  AddTmpComponent,
  MsgTemplateDetailComponent,
  MsgHistoryComponent,
];

const MESSAGE_PROVIDERS = [
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
    CovalentDynamicFormsModule,
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
    MessageRoutingModule,
  ],
  declarations: [
    ...MESSAGE_COMPONENT
  ],
  providers: [
    ...MESSAGE_PROVIDERS,
  ]
})
export class MessageModule {
}
