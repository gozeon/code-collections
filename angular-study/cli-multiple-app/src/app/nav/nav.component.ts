import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  template: `
    <a routerLink="/app1" >App 1</a> |
    <a routerLink="/app2" >App 2</a>
  `,
  styles: []
})
export class NavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
