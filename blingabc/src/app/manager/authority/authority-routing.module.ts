import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthorityManagerComponent} from './authority-manager.component';
import {StaffGroupComponent} from './staff-group/staff-group.component';
import {SettingComponent} from './setting/setting.component';

const routes: Routes = [
  {
    path: '', component: AuthorityManagerComponent, children: [
    {path: '', redirectTo: 'staff', pathMatch: 'full'},
    {
      path: 'staff', children: [
      {path: '', component: StaffGroupComponent, pathMatch: 'full'},
    ]
    },
    {
      path: 'setting', children: [
      {path: '', component: SettingComponent, pathMatch: 'full'},
    ]
    },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorityRoutingModule {
}
