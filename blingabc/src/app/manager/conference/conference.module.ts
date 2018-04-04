import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentLayoutModule, CovalentLoadingModule,
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
import {ConferenceManagerComponent} from './conference-manager.component';
import {ConferenceConfigComponent} from './conference-config/conference-config.component';
import {ConferenceRoutingModule} from './conference-routing.module';
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

const CONFERENCE_COMPONENT = [
  ConferenceManagerComponent,
  ConferenceConfigComponent,
  ConferenceGrabConfigComponent,
  RenewalComponent,
  AddRenewalComponent,
  UpdateRenewalComponent,
  DistributionComponent,
  AddDistributionComponent,
  UpdateDistributionComponent,
  FreshmanGuidanceConfigComponent,
  AddFreshmanGuidanceComponent,
  UpdateFreshmanGuidanceComponent,
];

const CONFERENCE_PROVIDERS = [
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
    ConferenceRoutingModule,
  ],
  declarations: [
    ...CONFERENCE_COMPONENT,
  ],
  providers: [
    ...CONFERENCE_PROVIDERS,
  ]
})
export class ConferenceModule {
}
