import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.html',
  styleUrls: ['datepicker.scss']
})
export class DatepickerComponent implements OnInit {
  touch: boolean;
  filterOdd: boolean;
  yearView: boolean;
  inputDisabled: boolean;
  datepickerDisabled: boolean;
  minDate: Date;
  maxDate: Date;
  startAt: Date;
  date: Date;
  lastDateInput: Date | null;
  lastDateChange: Date | null;

  minDate1: Date;
  maxDate1: Date;
  constructor() {
  }

  ngOnInit() {
  }

  dateFilter = (date: Date) => date.getMonth() % 2 == 1 && date.getDate() % 2 == 0;
  onDateInput = (e: MatDatepickerInputEvent<Date>) => this.lastDateInput = e.value;
  onDateChange = (e: MatDatepickerInputEvent<Date>) => this.lastDateChange = e.value;
  dateCtrl = new FormControl();
}
