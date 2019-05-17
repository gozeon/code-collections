import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-nav></app-nav>
    <br/><br>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'my-app';
}
