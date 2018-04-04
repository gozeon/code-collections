import {Component, Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class BtnService {
  // change: EventEmitter<number>;
  public change: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.change = new EventEmitter();
  }
}
