import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trap-focus',
  template: `
      <div style="padding: 7px">
          <div cdkTrapFocus>
              <input type="text" placeholder="Name">
              <input type="text" placeholder="Surname">
              <button>Submit</button>
          </div>

          <h2>Outside the trap</h2>
          <input placeholder="Input outside the trap"/>
      </div>
  `,
  styles: []
})
export class TrapFocusComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
