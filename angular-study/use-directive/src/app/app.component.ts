import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  a = 2;
  b = 1;

  myVar = 1;
  fontSize = 20;
  isBordered = false;
  items = ['apple', 'banana', 'tree'];
  content = "is Content";

  myFun():boolean {
    return true;
  }
}
