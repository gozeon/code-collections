import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html',
  styleUrls: ['app.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class AppComponent {
  dark = false;
  navItems = [
    {name: 'Autocomplete', route: '/autocomplete'},
    {name: 'Button Toggle', route: '/button-toggle'},
    {name: 'Button', route: '/button'},
    {name: 'Card', route: '/card'},
    {name: 'Checkbox', route: '/checkbox'},
    {name: 'Chips', route: '/chips'},
    {name: 'Datepicker', route: '/datepicker'},
    {name: 'Dialog', route: '/dialog'},
    {name: 'Drawer', route: '/drawer'},
  ];

  constructor(private _element: ElementRef,
              private _overlayContainer: OverlayContainer) {
  }

  toggleFullscreen(): void {
    // @link http://devdocs.io/dom/fullscreen_api
    let elem = this._element.nativeElement.querySelector('.demo-content');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullScreen) {
      elem.msRequestFullScreen();
    }
  }

  toggleTheme(): void {
    const darkThemeClass = 'unicorn-dark-theme';

    this.dark = !this.dark;

    if (this.dark) {
      this._element.nativeElement.classList.add(darkThemeClass);
      this._overlayContainer.getContainerElement().classList.add(darkThemeClass);
    } else {
      this._element.nativeElement.classList.remove(darkThemeClass);
      this._overlayContainer.getContainerElement().classList.remove(darkThemeClass);
    }
  }
}

@Component({
  moduleId: module.id,
  selector: 'entry-app',
  template: '<router-outlet></router-outlet>',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class EntryApp {
}

@Component({
  selector: 'home',
  template: `
      <p>Welcome to the development demos for Angular Material!</p>
      <p>Open the sidenav to select a demo.</p>
  `
})
export class Home {
}
