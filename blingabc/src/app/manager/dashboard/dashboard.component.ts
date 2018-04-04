import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';
import { Title } from '@angular/platform-browser';
import { TdDigitsPipe } from '@covalent/core';
import { single, multi } from './data';

const NUMBER_FORMAT: any = (v: number) => v.toFixed(1);
const DECIMAL_FORMAT: any = (v: number) => v.toFixed(1);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  avatar = 'https://placekitten.com/g/200/200';
  user: any;

  constructor() {
    this.user = JSON.parse(localStorage.getItem('info'));
    if (this.user.headImg !== null) {
      this.avatar = this.user.headImg;
    }
  }

  ngOnInit(): void {
  }

}
