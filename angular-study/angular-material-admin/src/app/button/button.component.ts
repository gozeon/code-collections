import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: 'button.html',
  styleUrls: ['button.scss']
})
export class ButtonComponent implements OnInit {

  isDisabled: boolean = false;
  clickCounter: number = 0;
  toggleDisable: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
