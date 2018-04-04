import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistributionManagerComponent } from './distribution-manager.component';
import { DistributionTeacherComponent } from './distribution-teacher/distribution-teacher.component';
import { DistributionWithdrawProhibitedComponent } from './distribution-withdraw-prohibited/distribution-withdraw-prohibited.component';
import { DistributionWithdrawComponent } from './distribution-withdraw/distribution-withdraw.component';
import { DistributionCommissionComponent } from './distribution-commission/distribution-commission.component';
import { AddDistributionTeacherComponent } from './distribution-teacher/add-distribution-teacher/add-distribution-teacher.component';
import { AddDistributionWithdrawProhibitedComponent } from './distribution-withdraw-prohibited/add-distribution-withdraw-prohibited/add-distribution-withdraw-prohibited.component';


const routes: Routes = [
  {
    path: '', component: DistributionManagerComponent, children: [
      {path: '', redirectTo: 'teacher', pathMatch: 'full'},
      {
        path: 'teacher', children: [
          {path: '', component: DistributionTeacherComponent, pathMatch: 'full'},
          {path: 'add', component: AddDistributionTeacherComponent},
        ]
      },
      {
        path: 'commission', children: [
          {path: '', component: DistributionCommissionComponent, pathMatch: 'full'}
        ]
      },
      {
        path: 'withdraw', children: [
          {path: '', component: DistributionWithdrawComponent, pathMatch: 'full'}
        ]
      },
      {
        path: 'withdraw-prohibited', children: [
          {path: '', component: DistributionWithdrawProhibitedComponent, pathMatch: 'full'},
          {path: 'add', component: AddDistributionWithdrawProhibitedComponent},
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributionRoutingModule {
}
