import { NgModule } from '@angular/core';

import { HiddenDirective } from './../directives/hidden.directive';
import { UnderlineDirective } from './../directives/underline.directive';
import { IfDirective } from './../directives/if.directive';

@NgModule({
  declarations: [
    HiddenDirective,
    UnderlineDirective,
    IfDirective
  ],
  exports: [
    HiddenDirective,
    UnderlineDirective,
    IfDirective
  ]
})
export class ShareModule { }
