import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  template: `
  <h3>demo</h3>
  <router-outlet></router-outlet>
`,

})
export class DemoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@Component({
  selector: 'demo',
  template: `
  <div>demo1</div>
`,

})
export class Demo1Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
