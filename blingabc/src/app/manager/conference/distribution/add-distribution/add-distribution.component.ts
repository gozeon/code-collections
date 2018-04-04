import { Component, OnInit } from '@angular/core';
import { BaseService, verifyMiddleWare } from '../../../../services/base.service';
import { ConferenceService } from '../../../../services/conference.service';
import { Router } from '@angular/router';
import { Md2Toast } from '../../../../common/toast/toast';
import * as moment from 'moment';

@Component({
  selector: 'app-add-distribution',
  templateUrl: './add-distribution.component.html',
  styleUrls: ['./add-distribution.component.scss']
})
export class AddDistributionComponent implements OnInit {
  seasons: any[];
  years = [2018, 2019, 2020];

  data = {
    year: undefined,
    term: undefined,
    beginDate: undefined,
    endDate: undefined,
    remark: undefined,

  };

  constructor(private _baseService: BaseService,
              private _conferenceService: ConferenceService,
              private _route: Router,
              private _toast: Md2Toast) {
    this._baseService.getAllTerms().subscribe(v => this.seasons = (v));
  }

  ngOnInit() {
  }

  onSubmit(): void {
    if (this.verifyTime(this.data.beginDate, this.data.endDate)) {
      this._toast.show('时间未填写或不合理', 1800);
      return;
    }

    const data = Object.assign({}, this.data, {
      beginDate: this.data.beginDate ? moment(this.data.beginDate).format('x') : undefined,
      endDate: this.data.endDate ? moment(this.data.endDate).format('x') : undefined,
    });
    this._conferenceService.addDistribution(data).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('添加成功', 1800);
        this._route.navigate(['/main/conference/distribution']);
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
