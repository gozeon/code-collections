import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConferenceManagerComponent } from './conference-manager.component';
import { ConferenceConfigComponent } from './conference-config/conference-config.component';
import { ConferenceGrabConfigComponent } from './conference-grab-config/conference-grab-config.component';
import { RenewalComponent } from './renewal/renewal.component';
import { AddRenewalComponent } from './renewal/add-renewal/add-renewal.component';
import { UpdateRenewalComponent } from './renewal/update-renewal/update-renewal.component';
import { DistributionComponent } from './distribution/distribution.component';
import { AddDistributionComponent } from './distribution/add-distribution/add-distribution.component';
import { UpdateDistributionComponent } from './distribution/update-distribution/update-distribution.component';
import { FreshmanGuidanceConfigComponent } from './freshman-guidance-config/freshman-guidance-config.component';
import { AddFreshmanGuidanceComponent } from './freshman-guidance-config/add-freshman-guidance/add-freshman-guidance.component';
import { UpdateFreshmanGuidanceComponent } from './freshman-guidance-config/update-freshman-guidance/update-freshman-guidance.component';

const routes: Routes = [
  {
    path: '', component: ConferenceManagerComponent, children: [
      {path: '', redirectTo: 'config', pathMatch: 'full'},
      {path: 'config', component: ConferenceConfigComponent},
      {path: 'grab-config', component: ConferenceGrabConfigComponent},
      {
        path: 'renewal', children: [
          {path: '', component: RenewalComponent, pathMatch: 'full'},
          {path: 'add', component: AddRenewalComponent, pathMatch: 'full'},
          {path: 'detail/:id', component: UpdateRenewalComponent, pathMatch: 'full'},
        ]
      },
      {
        path: 'distribution', children: [
          {path: '', component: DistributionComponent, pathMatch: 'full'},
          {path: 'add', component: AddDistributionComponent, pathMatch: 'full'},
          {path: 'detail/:id', component: UpdateDistributionComponent, pathMatch: 'full'},
        ]
      },
      {
        path: 'freshman-guidance', children: [
          {path: '', component: FreshmanGuidanceConfigComponent, pathMatch: 'full'},
          {path: 'add', component: AddFreshmanGuidanceComponent, pathMatch: 'full'},
          {path: 'detail/:id', component: UpdateFreshmanGuidanceComponent, pathMatch: 'full'},
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConferenceRoutingModule {
}
