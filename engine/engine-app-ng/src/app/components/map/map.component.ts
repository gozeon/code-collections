import { Component, OnInit } from '@angular/core';

import * as gg from 'engine-api';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    (<any>window).gg = gg;
    (<any>window).Map = gg.Map;
    (<any>Map).init();
  }

}
