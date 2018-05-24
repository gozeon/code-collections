import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {PortalHostDirective, TemplatePortal} from '@angular/cdk/portal';

@Component({
  selector: 'app-portal-host',
  template: `
      <div class="backdrop"></div>
    
    <div class="portal-host">
        <div cdkPortalHost></div>
    </div>
    
    <button (click)="project()">Project content</button>
    
    <ng-template>
        <h1>{{ counter }}</h1>
        <button (click)="counter = counter + 1">Increment</button>
    </ng-template>
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
export class PortalHostComponent {
  @ViewChild(PortalHostDirective) host: PortalHostDirective;
  @ViewChild(TemplateRef) content: TemplateRef<any>;
  counter = 0;

  constructor() {
  }

  project() {
    const portal = new TemplatePortal(this.content, null);
    this.host.attachTemplatePortal(portal);
  }

}
