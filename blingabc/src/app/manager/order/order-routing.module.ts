import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderManagerComponent } from './order-manager.component';
import { OrderVerifyComponent } from './order-verify/order-verify.component';
import { OrderDetailComponent } from './order-verify/order-detail/order-detail.component';
import { OrderLogComponent } from './order-log/order-log.component';
import { OrderCheckComponent } from './order-check/order-check.component';
import { RetiredVerifyComponent } from './retired-verify/retired-verify.component';
import { ChangeClassComponent } from './change-class/change-class.component';
import { ChangeClassDetailComponent } from './change-class/change-class-detail/change-class-detail.component';
import { RetiredDetailComponent } from './retired-verify/retired-detail/retired-detail.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { RetiredClassComponent } from './retired-class/retired-class.component';
import { ManualRefundComponent } from './manual-refund/manual-refund.component';

const routes: Routes = [
  {
    path: '', component: OrderManagerComponent, children: [
      {path: '', redirectTo: 'order-verify', pathMatch: 'full'},
      {
        path: 'manual-refund', children: [
          {path: '', component: ManualRefundComponent, pathMatch: 'full'},
        ]
      },
      {
        path: 'order-verify', children: [
          {path: '', component: OrderVerifyComponent, pathMatch: 'full'},
          {path: 'detail/:id', component: OrderDetailComponent, data: {back: 'order-verify'}},
        ]
      },
      {
        path: 'order-log', children: [
          {path: '', component: OrderLogComponent, pathMatch: 'full'},
          {path: 'detail/:id', component: OrderDetailComponent, data: {back: 'order-log'}},
        ]
      },
      {
        path: 'order-check', children: [
          {path: '', component: OrderCheckComponent, pathMatch: 'full'},
          {path: 'detail/:id', component: OrderDetailComponent, data: {back: 'order-check'}},
        ]
      },
      {
        path: 'retired-verify', children: [
          {path: '', component: RetiredVerifyComponent, pathMatch: 'full'},
          {path: 'detail/:id', component: RetiredDetailComponent},
        ]
      },
      {
        path: 'retired-class', children: [
          {path: '', component: RetiredClassComponent, pathMatch: 'full'},
          {
            path: 'detail/:id', component: RetiredDetailComponent, data: {type: 'retired-class'}
          },
        ]
      },
      {
        path: 'change-class', children: [
          {path: '', component: ChangeClassComponent, pathMatch: 'full'},
          {path: 'detail/:id', component: ChangeClassDetailComponent},
        ]
      },
      {path: 'add', component: AddOrderComponent, pathMatch: 'full'},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {
}
