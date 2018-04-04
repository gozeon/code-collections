import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-handle-problem-record',
  templateUrl: './handle-problem-record.component.html',
  styleUrls: ['./handle-problem-record.component.scss']
})
export class HandleProblemRecordComponent implements OnInit {
  mainUri = '/main/customer/problem';

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit() {
  }
}
