import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['/directory.component.css']
})
export class DirectoryComponent implements OnInit, AfterViewInit {
  @Output() seleteNode: EventEmitter<any>;
  examples = require('engine-api/example/examples.json');
  constructor() {
    this.seleteNode = new EventEmitter();
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  nodeWasClick = (e: any) => {
    this.seleteNode.emit(e);
  }
}
