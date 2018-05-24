import { Component } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: 'drawer.html',
  styles: [`
      .demo-drawer-container {
          border: 3px solid black;
      }

      .demo-drawer-content {
          padding: 15px;
      }
  `]
})
export class DrawerComponent {
  invert = false;

  constructor() {
  }
}
