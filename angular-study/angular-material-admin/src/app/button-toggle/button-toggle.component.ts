import { Component } from '@angular/core';

@Component({
  selector: 'app-button-toggle',
  template: `
      <p>
          <mat-checkbox (change)="isVertical = $event.checked">Show Button Toggles Vertical</mat-checkbox>
      </p>
      
      <p>
          <mat-checkbox (change)="isDisabled = $event.checked">Disable Button Toggle Items</mat-checkbox>
      </p>

      <h1>Exclusive Selection</h1>

      <section class="demo-section">
          <mat-button-toggle-group name="alignment" [vertical]="isVertical">
              <mat-button-toggle value="left">
                  <mat-icon>format_align_left</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle value="center">
                  <mat-icon>format_align_center</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle value="right">
                  <mat-icon>format_align_right</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle value="justify" [disabled]="isDisabled">
                  <mat-icon>format_align_justify</mat-icon>
              </mat-button-toggle>
          </mat-button-toggle-group>
      </section>

      <h1>Disabled Group</h1>

      <section class="demo-section">
          <mat-button-toggle-group name="checkbox" [vertical]="isVertical" [disabled]="isDisabled">
              <mat-button-toggle value="bold">
                  <mat-icon>format_bold</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle value="italic">
                  <mat-icon>format_italic</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle value="underline">
                  <mat-icon>format_underline</mat-icon>
              </mat-button-toggle>
          </mat-button-toggle-group>
      </section>

      <h1>Multiple Selection</h1>
      <section class="demo-section">
          <mat-button-toggle-group multiple [vertical]="isVertical">
              <mat-button-toggle>Flour</mat-button-toggle>
              <mat-button-toggle>Eggs</mat-button-toggle>
              <mat-button-toggle>Sugar</mat-button-toggle>
              <mat-button-toggle [disabled]="isDisabled">Milk</mat-button-toggle>
          </mat-button-toggle-group>
      </section>

      <h1>Single Toggle</h1>
      <mat-button-toggle>Yes</mat-button-toggle>

      <h1>Dynamic Exclusive Selection</h1>
      <section class="demo-section">
          <mat-button-toggle-group name="pies" [(ngModel)]="favoritePie" [vertical]="isVertical">
              <mat-button-toggle *ngFor="let pie of pieOptions" [value]="pie">
                  {{pie}}
              </mat-button-toggle>
          </mat-button-toggle-group>
          <p>Your favorite type of pie is: {{favoritePie}}</p>
      </section>
  `,
  styles: []
})
export class ButtonToggleComponent {
  isVertical = false;
  isDisabled = false;
  favoritePie = 'Apple';
  pieOptions = [
    'Apple',
    'Cherry',
    'Pecan',
    'Lemon',
  ];

  constructor() {
  }
}
