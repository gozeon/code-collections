import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';
import {MatRadioModule} from '@angular/material';

@Component({
  selector: 'app-msg-template-detail',
  templateUrl: './msg-template-detail.component.html',
  styleUrls: ['./msg-template-detail.component.scss']
})
export class MsgTemplateDetailComponent implements OnInit {

  constructor() { }
  data: any[] = [
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork' },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork' },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork' },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork' },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork' },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork' },

  ];
  columns: ITdDataTableColumn[] = [
    // { name: 'operation', label: '操作'},
    { name: 'class', label: '类型', },
    { name: 'courseName', label: '模板编号' },
    { name: 'courseNum', label: '模板内容'},
    { name: 'foreignTea', label: '审核状态' },
  ];
  textElements = [
    {
      "name": "content",
      'label': '发送内容',
      "type": "textarea",
      "required": false
    },
    {
      "name": "summary",
      "type": "textarea",
      'label': '模板说明',
      "required": false
    }
  ]
  ngOnInit() {
  }

}
