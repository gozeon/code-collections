import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent, EntryApp, Home } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DependModule } from './depend.module';
import { RouterModule } from '@angular/router';
import { ALL_ROUTES } from './routes';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonToggleComponent } from './button-toggle/button-toggle.component';
import { ButtonComponent } from './button/button.component';
import { CardComponent } from './card/card.component';
import { CheckboxComponent, MatCheckboxDemoNestedChecklist } from './checkbox/checkbox.component';
import { ChipsComponent } from './chips/chips.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { ContentElementDialog, DialogComponent, IFrameDialog, JazzDialog } from './dialog/dialog.component';
import { DrawerComponent } from './drawer/drawer.component';

@NgModule({
  declarations: [
    EntryApp,
    AppComponent,
    Home,
    AutocompleteComponent,
    ButtonToggleComponent,
    ButtonComponent,
    CardComponent,
    CheckboxComponent,
    MatCheckboxDemoNestedChecklist,
    ChipsComponent,
    DatepickerComponent,
    DialogComponent,
    JazzDialog,
    ContentElementDialog,
    IFrameDialog,
    DrawerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DependModule,
    RouterModule.forRoot(ALL_ROUTES),
  ],
  providers: [],
  entryComponents: [
    EntryApp,
    JazzDialog,
    ContentElementDialog,
    IFrameDialog,
  ],
  bootstrap: [EntryApp]
})
export class AppModule { }
