import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

export interface Person {
  name: string;
}

export interface DemoColor {
  name: string;
  color: string;
}

@Component({
  selector: 'app-chips',
  templateUrl: 'chips.html',
  styleUrls: [
    'chips.scss'
  ]
})
export class ChipsComponent implements OnInit {
  tabIndex: number = 0;
  visible: boolean = true;
  color: string = '';
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  message: string = '';


  selectedPeople = null;

  // Enter, comma, semi-colon
  separatorKeysCodes = [ENTER, COMMA, 186];

  selectedColors: any[] = ['Primary', 'Warn'];
  selectedColor = 'Accent';

  people: Person[] = [
    {name: 'Kara'},
    {name: 'Jeremy'},
    {name: 'Topher'},
    {name: 'Elad'},
    {name: 'Kristiyan'},
    {name: 'Paul'}
  ];

  availableColors: DemoColor[] = [
    {name: 'none', color: ''},
    {name: 'Primary', color: 'primary'},
    {name: 'Accent', color: 'accent'},
    {name: 'Warn', color: 'warn'}
  ];

  constructor() {
  }

  ngOnInit() {
  }

  displayMessage(message: string): void {
    this.message = message;
  }

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our person
    if ((value || '').trim()) {
      this.people.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(person: Person): void {
    let index = this.people.indexOf(person);

    if (index >= 0) {
      this.people.splice(index, 1);
    }
  }

  removeColor(color: DemoColor) {
    let index = this.availableColors.indexOf(color);

    if (index >= 0) {
      this.availableColors.splice(index, 1);
    }

    index = this.selectedColors.indexOf(color.name);

    if (index >= 0) {
      this.selectedColors.splice(index, 1);
    }
  }

  toggleVisible(): void {
    this.visible = false;
  }
}
