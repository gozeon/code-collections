import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Md2Toast, Md2ToastConfig, Md2ToastComponent } from './toast';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';

export * from './toast';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PlatformModule
  ],
  exports: [Md2ToastComponent],
  declarations: [Md2ToastComponent],
  entryComponents: [Md2ToastComponent],
  providers: [Md2Toast, Md2ToastConfig],
})
export class Md2ToastModule { }
