import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-change-class-detail',
  templateUrl: './change-class-detail.component.html',
  styleUrls: ['./change-class-detail.component.scss']
})
export class ChangeClassDetailComponent implements OnInit {


  myForm: FormGroup;
  constructor(private fb: FormBuilder, private _dialog: MatDialog) { }
  data: any[] = [{
    "edit": 1,
    "createDate": "2017-08-31 20:10:50",
    "orderCode": "1234",
    "lessonCount": 10,
    "orderPrice": 53.23,
    "realPrice": 53.23,
    "favorablePrice": 0,
    "payStatus": 0,
    "orderStatus": 1,
    "payDate": "2017-08-31 20:11:15",
  }]
  types = [];
  columns: any[] = [
    { name: "等待待审核", value: '' },
    { name: "已驳回", value: '' },
    { name: "审核通过", value: '' },
    { name: "待支付", value: '' },
    { name: "已支付", value: '' },
    { name: "已取消", value: '' },
  ];
  ngOnInit() {
    this.myForm = this.fb.group({
      f1: [""],
      f2: [""],
      f3: [""],
      f4: [""],
    })
  }
  post(val: any) {
  }
  openCheckStatusDialog() {
  }

}
