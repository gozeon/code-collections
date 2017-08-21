import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, AfterViewInit {
  @Input() domId: string;
  @Input() nodes: any;
  @Output() onNodeClick: EventEmitter<any>;

  constructor() {
    this.onNodeClick = new EventEmitter();
  }

  ngOnInit() { }

  ngAfterViewInit() {
    const onNodeClick = this.onNodeClick;

    $(`#${this.domId}`).tree({
      closedIcon: $('<i class="fa fa-caret-right" aria-hidden="true"></i>'),
      openedIcon: $('<i class="fa fa-caret-down" aria-hidden="true"></i>'),
      data: this.nodes
    });

    $(`#${this.domId}`).bind(
      'tree.click',
      function (event) {
        onNodeClick.emit(event);
      }
    );

  }

}
