import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss']
})
export class ViewImageComponent implements OnInit {
  imgUrl: string;

  constructor(public dialogRef: MatDialogRef<ViewImageComponent>, private _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.imgUrl = <any>this._sanitizer.bypassSecurityTrustResourceUrl(data);
  }

  ngOnInit() {
  }

}
