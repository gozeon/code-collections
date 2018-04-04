import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {
  uri: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.uri = this.data.uri || '';
  }

  ngOnInit() {
  }

}
