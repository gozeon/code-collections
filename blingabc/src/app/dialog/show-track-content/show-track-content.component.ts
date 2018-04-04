import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-show-track-content',
  templateUrl: './show-track-content.component.html',
  styleUrls: ['./show-track-content.component.scss']
})
export class ShowTrackContentComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
