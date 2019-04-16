import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <a routerLink="/home" routerLinkActive="active">Home</a>
    <a routerLink="/about" routerLinkActive="active">about</a>
    <router-outlet></router-outlet>
    <button (click)="onClick()">Sum</button>
    <button (click)="onClick2()">Now</button>
  `,
  styles: [
    `
    a {
      text-decoration: none;
      color: #000;
      padding: 2px 4px;
    }
    a:hover, .active {
      background: #a6e5f5;
      color: #fff;
    }
    `
  ]
})
export class AppComponent {
  title = 'd';

  onClick() {
    import('./a').then(module => alert(module.sum(1, 2)));
  }

  onClick2() {
    import('./b').then(module => alert(module.now()));
  }
}
