import * as gg from 'engine-api';

export class UIHud implements gg.HudProtocol {
  static dom = <HTMLElement>document.querySelector('#spinkit');
  show(): void {
    UIHud.dom.style.display = 'flex';
  }
  hide(): void {
    UIHud.dom.style.display = 'none';
  }
}
