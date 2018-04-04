import { Component, OnInit } from '@angular/core';
import { BaseService, verifyMiddleWare } from '../../../../services/base.service';
import { ConferenceService } from '../../../../services/conference.service';
import * as moment from 'moment';
import { Md2Toast } from '../../../../common/toast/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-renewal',
  templateUrl: './add-renewal.component.html',
  styleUrls: ['./add-renewal.component.scss']
})
export class AddRenewalComponent implements OnInit {
  seasons: any[];
  years = [2018, 2019, 2020];

  data = {
    originalYear: undefined,
    originalTerm: undefined,
    resubmitYear: undefined,
    resubmitTerm: undefined,
    originalBeginDate: undefined,
    originalEndDate: undefined,
    newBeginDate: undefined,
    newEndDate: undefined,
    remark: undefined,
    resubmitDesc: undefined,
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
    if (this.verifyTime(this.data.originalBeginDate, this.data.originalEndDate)) {
      this._toast.show('原班续报时间未填写或不合理', 1800);
      return;
    }

    if (this.verifyTime(this.data.newBeginDate, this.data.newEndDate)) {
      this._toast.show('非原班续报时间未填写或不合理', 1800);
      return;
    }

    const data = Object.assign({}, this.data, {
      originalBeginDate: this.data.originalBeginDate ? moment(this.data.originalBeginDate).format('x') : undefined,
      originalEndDate: this.data.originalEndDate ? moment(this.data.originalEndDate).format('x') : undefined,
      newBeginDate: this.data.newBeginDate ? moment(this.data.newBeginDate).format('x') : undefined,
      newEndDate: this.data.newEndDate ? moment(this.data.newEndDate).format('x') : undefined,
    });
    this._conferenceService.addRenewal(data).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('添加成功', 1800);
        this._route.navigate(['/main/conference/renewal']);
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
