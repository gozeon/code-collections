import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ClassService } from '../../services/class.service';
import { verifyMiddleWare } from '../../services';

@Component({
  selector: 'app-check-quite-class-account',
  templateUrl: './check-quite-class-account.component.html',
  styleUrls: ['./check-quite-class-account.component.scss']
})
export class CheckQuiteClassAccountComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _classService: ClassService,
              public dialogRef: MatDialogRef<CheckQuiteClassAccountComponent>,) {
  }

  ngOnInit() {
  }

  submit() {
    this._classService.changeAccount(this.data).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this.dialogRef.close(true);
      }
    });
  }
}
