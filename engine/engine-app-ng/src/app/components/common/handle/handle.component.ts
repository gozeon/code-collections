import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-handle',
  templateUrl: './handle.component.html',
  styleUrls: ['./handle.component.css']
})
export class HandleComponent implements OnInit, AfterViewInit {
  @Input() status: string;
  @Input() domId: string;
  private imgUrl: string;

  constructor() {
  }

  checkStyleType(type: string): string {
    switch (type) {
      case 'vertical':
        return 'assets/images/vertical_handle.png';
      case 'horizontal':
        return 'assets/images/handle.png';
      default:
        return '';
    }
  }

  ngOnInit() {
    this.imgUrl = this.checkStyleType(this.status);
  }

  ngAfterViewInit() {
  }
}
