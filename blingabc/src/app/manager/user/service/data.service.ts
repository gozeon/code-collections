import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DataService {
  dataEmitter = new EventEmitter<any>();
}
