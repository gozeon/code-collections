import { Routes } from '@angular/router';
import { AppComponent, Home } from './app.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ButtonToggleComponent } from './button-toggle/button-toggle.component';
import { ButtonComponent } from './button/button.component';
import { CardComponent } from './card/card.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ChipsComponent } from './chips/chips.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DialogComponent } from './dialog/dialog.component';
import { DrawerComponent } from './drawer/drawer.component';

export const DEMO_APP_ROUTES: Routes = [
  {
    path: '', component: AppComponent, children: [
    {path: '', component: Home},
    {path: 'autocomplete', component: AutocompleteComponent},
    {path: 'button-toggle', component: ButtonToggleComponent},
    {path: 'button', component: ButtonComponent},
    {path: 'card', component: CardComponent},
    {path: 'checkbox', component: CheckboxComponent},
    {path: 'chips', component: ChipsComponent},
    {path: 'datepicker', component: DatepickerComponent},
    {path: 'dialog', component: DialogComponent},
    {path: 'drawer', component: DrawerComponent},
  ]
  }
];

export const ALL_ROUTES: Routes = [
  {path: '', component: AppComponent, children: DEMO_APP_ROUTES},
];