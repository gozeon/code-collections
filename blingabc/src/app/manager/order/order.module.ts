import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentMediaModule,
  CovalentPagingModule, CovalentSearchModule, CovalentLoadingModule
} from '@covalent/core';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatRadioModule,
  MatSelectModule, MatToolbarModule, MatTabsModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderManagerComponent } from './order-manager.component';
import { OrderVerifyComponent } from './order-verify/order-verify.component';
import { OrderDetailComponent } from './order-verify/order-detail/order-detail.component';
import { OrderLogComponent } from './order-log/order-log.component';
import { OrderCheckComponent } from './order-check/order-check.component';
import { RetiredVerifyComponent } from './retired-verify/retired-verify.component';
import { ChangeClassComponent } from './change-class/change-class.component';
import { ChangeClassDetailComponent } from './change-class/change-class-detail/change-class-detail.component';
import { RetiredDetailComponent } from './retired-verify/retired-detail/retired-detail.component';
import { OrderRoutingModule } from './order-routing.module';
import { ShareModule } from '../share.module';
import { RetiredClassComponent } from './retired-class/retired-class.component';
import { Md2DatepickerModule } from '../../common/datepicker/index';
import { ManualRefundComponent } from './manual-refund/manual-refund.component';

const ORDER_COMPONENT = [
  OrderManagerComponent,
  OrderVerifyComponent,
  OrderDetailComponent,
  OrderLogComponent,
  OrderCheckComponent,
  RetiredVerifyComponent,
  RetiredDetailComponent,
  ChangeClassComponent,
  ChangeClassDetailComponent,
  RetiredClassComponent,
  ManualRefundComponent,
];

const ORDER_PROVIDERS = [
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
    CovalentLoadingModule,
    CovalentMediaModule,
    CovalentSearchModule,
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
    OrderRoutingModule,
    ShareModule,
    MatTabsModule
  ],
  declarations: [
    ...ORDER_COMPONENT,
  ],
  providers: [
    ...ORDER_PROVIDERS,
  ]
})
export class OrderModule {
}
