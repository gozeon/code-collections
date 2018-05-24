import { Directive, Renderer, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUnderline]'
})
export class UnderlineDirective {

  constructor(private renderer: Renderer, private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.hover(true)
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover(false)
  }

  hover(shouldUnderline: boolean) {
    if (shouldUnderline) {
      console.log('mouse enter');
    } else {
      console.log('mouse leave');
    }
  }
}
