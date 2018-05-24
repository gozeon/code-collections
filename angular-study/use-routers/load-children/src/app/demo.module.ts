import { DemoComponent, Demo1Component } from './demo.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoRoutingModule } from './demo-routing.module';

const DEMO_COMPONENT = [
  DemoComponent,
  Demo1Component,
]

@NgModule({
  imports: [
    CommonModule,
    DemoRoutingModule
  ],
  declarations: [
    ...DEMO_COMPONENT
  ]
})
export class DemoModule { }
