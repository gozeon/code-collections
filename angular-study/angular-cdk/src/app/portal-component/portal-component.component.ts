import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentPortal, PortalHostDirective } from '@angular/cdk/portal';

@Component({
  selector: 'projected-content',
  template: `
    <h1>{{counter}}</h1>
    <button (click)="counter = counter + 1">Increment</button>
  `
})
export class ProjectedContent {
  counter = 0;
}

@Component({
  selector: 'app-portal-component',
  template: `
      <div class="backdrop"></div>

      <div class="portal-host">
          <div cdkPortalHost></div>
      </div>

      <button (click)="project()">Project content</button>
  `,
  styles: [`
      .portal-host {
          padding: 7px;
          width: 250px;
          height: 250px;
          border: solid 3px #ccc;
          position: fixed;
          bottom: 10px;
          right: 10px;
          background: #fff;
          padding: 10px;
          overflow: auto;
      }

      .backdrop {
          display: block;
          content: '';
          background: rgba(0, 0, 0, 0.5);
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          position: fixed;
      }

      button {
          position: relative;
          z-index: 2;
          margin: 10px;
      }
  `]
})
export class PortalComponentComponent {
  @ViewChild(PortalHostDirective) host: PortalHostDirective;
  constructor() { }

  project() {
    const portal = new ComponentPortal(ProjectedContent);
    this.host.attachComponentPortal(portal);
  }
}
