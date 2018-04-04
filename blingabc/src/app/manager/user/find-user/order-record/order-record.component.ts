import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-order-record',
  templateUrl: './order-record.component.html',
  styleUrls: ['./order-record.component.scss']
})
export class OrderRecordComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  data: any[] = [
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork', isLeave: '否',
    classTime: '1452-2', courseSta: '正常', Absenteeism: 1 },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork', isLeave: '否',
    classTime: '1452-2', courseSta: '正常', Absenteeism: 1 },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork', isLeave: '否',
    classTime: '1452-2', courseSta: '正常', Absenteeism: 1 },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork', isLeave: '否',
    classTime: '1452-2', courseSta: '正常', Absenteeism: 1 },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork', isLeave: '否',
    classTime: '1452-2', courseSta: '正常', Absenteeism: 1 },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork', isLeave: '否',
    classTime: '1452-2', courseSta: '正常', Absenteeism: 1 },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork', isLeave: '否',
    classTime: '1452-2', courseSta: '正常', Absenteeism: 1 },
    { class: '1111', courseName: '主课' ,
    courseNum: '1452-2', foreignTea: 'Pork', isLeave: '否',
    classTime: '1452-2', courseSta: '正常', Absenteeism: 1 },

  ];
  columns: ITdDataTableColumn[] = [
    // { name: 'operation', label: '操作'},
    { name: 'class', label: '班级', },
    { name: 'courseName', label: '课时名称' },
    { name: 'courseNum', label: '课次'},
    { name: 'foreignTea', label: '上课外教' },
    { name: 'isLeave', label: '是否请假'},
    { name: 'classTime', label: '上课时间' },
    { name: 'courseSta', label: '课时状态'},
    { name: 'Absenteeism', label: '缺勤人数' },
  ];
}
