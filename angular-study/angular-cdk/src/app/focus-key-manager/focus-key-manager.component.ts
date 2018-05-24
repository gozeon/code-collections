import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';


@Component({
  selector: 'list-item',
  template: '<ng-content></ng-content>',
  host: {
    'tabindex': '-1',
    '[class.disabled]': 'disabled'
  },
  styles: [
    `
      :host {
        display: block;
        padding: 10px 5px;
        border-bottom: solid 1px #ccc;
      }
      
      :host:focus {
        background: #ccc;
        color: #fff;
      }
      
      :host.disabled {
        color: #ddd;
        pointer-events: none;
      }
    `
  ]
})
export class ListItem {
  @Input() disabled: boolean;

  constructor(private _elementRef: ElementRef) {}

  focus() {
    this._elementRef.nativeElement.focus();
  }
}

@Component({
  selector: 'app-focus-key-manager',
  template: `
      <div tabindex="0"
           (keydown)="keyManager.onKeydown($event)"
           style="margin: 20px; max-width: 500px; border: solid 1px #ccc; border-bottom: none;"
           class="list">
          <list-item *ngFor="let i of [0, 1, 2, 3, 4]" [disabled]="i === 3">Item {{i}}</list-item>
      </div>
  `,
  styles: []
})
export class FocusKeyManagerComponent implements OnInit, AfterViewInit {
  @ViewChildren(ListItem) items: QueryList<ListItem>;
  keyManager: FocusKeyManager<ListItem>;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.keyManager = new FocusKeyManager<ListItem>(this.items).withWrap();
    this.keyManager.setFirstItemActive();
  }
}