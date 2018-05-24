import { Directive, ElementRef, Renderer, Input } from '@angular/core';

@Directive({
  selector: '[appHidden]'
})
export class HiddenDirective {

  constructor(public _el: ElementRef, public _renderer: Renderer) { }

  @Input() appHidden: boolean;

  ngOnInit() {
    if (this.appHidden) {
      this._renderer.setElementStyle(this._el.nativeElement, 'display', 'none');
    }
  }

  // constructor(public _el: ElementRef, public _renderer: Renderer) {
  //   this._renderer.setElementStyle(this._el.nativeElement, 'display', 'none');
  // }

}
