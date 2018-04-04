import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-order-checked',
  templateUrl: './order-checked.component.html',
  styleUrls: ['./order-checked.component.scss']
})
export class OrderCheckedComponent implements OnInit {

  isSelect = false;
  checkedTypes: any = [
    { name: '待审核', value: 0 },
    { name: '审核通过', value: 1 },
    { name: '驳回', value: 2 },
  ];
  // 选择的数据
  selectData: any = { checkStatus: '', content: '' };

  constructor( @Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectData.checkStatus = data;
  }

  ngOnInit() {
  }

  change(ev: any) {
    this.isSelect = true;
  }

}
