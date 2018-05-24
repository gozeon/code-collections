import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TrapFocusComponent } from './trap-focus/trap-focus.component';
import { A11yModule } from '@angular/cdk/a11y';
import { FocusKeyManagerComponent, ListItem } from './focus-key-manager/focus-key-manager.component';
import { PortalHostComponent } from './portal-host/portal-host.component';
import { PortalModule } from '@angular/cdk/portal';
import { PortalComponentComponent, ProjectedContent } from './portal-component/portal-component.component';


@NgModule({
  declarations: [
    AppComponent,
    TrapFocusComponent,
    FocusKeyManagerComponent,
    ListItem,
    PortalHostComponent,
    PortalComponentComponent,
    ProjectedContent,
  ],
  imports: [
    BrowserModule,
    A11yModule,
    PortalModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ProjectedContent]
})
export class AppModule { }
