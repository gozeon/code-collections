import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService, verifyMiddleWare } from '../../../../services/base.service';
import { ConferenceService } from '../../../../services/conference.service';
import { Md2Toast } from '../../../../common/toast/index';
import * as moment from 'moment';

@Component({
  selector: 'app-update-renewal',
  templateUrl: './update-renewal.component.html',
  styleUrls: ['./update-renewal.component.scss']
})
export class UpdateRenewalComponent implements OnInit {
  seasons: any[];
  years = [2018, 2019, 2020];
  data = {
    id: undefined,
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

  constructor(private _activatedRoute: ActivatedRoute,
              private _baseService: BaseService,
              private _conferenceService: ConferenceService,
              private _route: Router,
              private _toast: Md2Toast) {
    this._baseService.getAllTerms().subscribe(v => this.seasons = (v));

    this._activatedRoute.params.subscribe(params => {
      if (Boolean(params['id'])) {
        this._conferenceService.getRenewalById(params['id']).subscribe(result => {
          this.data = {
            id: result.id || undefined,
            originalYear: result.originalYear || undefined,
            originalTerm: result.originalTerm || undefined,
            resubmitYear: result.resubmitYear || undefined,
            resubmitTerm: result.resubmitTerm || undefined,
            originalBeginDate: result.originalBeginDate ? moment(result.originalBeginDate).format() : undefined,
            originalEndDate: result.originalEndDate ? moment(result.originalEndDate).format() : undefined,
            newBeginDate: result.newBeginDate ? moment(result.newBeginDate).format() : undefined,
            newEndDate: result.newEndDate ? moment(result.newEndDate).format() : undefined,
            remark: result.remark || undefined,
            resubmitDesc: result.resubmitDesc || undefined,
          };
        });
      }
    });
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
    this._conferenceService.updateRenewal(data).subscribe(result => {
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
