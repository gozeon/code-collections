import { Component, OnInit } from '@angular/core';
import { BaseService, verifyMiddleWare } from '../../../../services';
import { Router } from '@angular/router';
import { Md2Toast } from '../../../../common/toast';
import * as moment from 'moment';
import { FreshmanGuidanceService } from '../../../../services/freshman-guidance.service';

@Component({
  selector: 'app-add-freshman-guidance',
  templateUrl: './add-freshman-guidance.component.html',
  styleUrls: ['./add-freshman-guidance.component.scss']
})
export class AddFreshmanGuidanceComponent implements OnInit {
  mainUri = '/main/conference/freshman-guidance';
  years = [2018, 2019, 2020];
  seasons: any[];
  stages: any[];
  data = {
    year: undefined,
    term: undefined,
    stage: undefined,
    startDate: undefined,
    endDate: undefined,
    type: 1,
  };


  constructor(private _baseService: BaseService,
              private _router: Router,
              private _toast: Md2Toast,
              private _FreshmanGuidanceService: FreshmanGuidanceService) {
    this._baseService.getAllTerms().subscribe(v => this.seasons = (v));
    this._baseService.getAllStages().subscribe(v => this.stages = (v));
  }

  ngOnInit() {
  }

  onSubmit(): void {
    if (this.verifyTime(this.data.startDate, this.data.endDate)) {
      this._toast.show('时间未填写或不合理', 1800);
      return;
    }

    const data = Object.assign({}, this.data, {
      startDate: moment(this.data.startDate).format('x'),
      endDate: moment(this.data.endDate).format('x'),
    });

    this._FreshmanGuidanceService.addFreshmanGuidance(data).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('添加成功', 1800);
        this._router.navigate([this.mainUri]);
      }
    });
  }

  verifyTime(start, end): boolean {
    if (!start || !end) {
      return true;
    }
    return moment(start).isAfter(end);
  }
}
