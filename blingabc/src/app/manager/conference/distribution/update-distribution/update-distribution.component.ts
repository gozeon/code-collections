import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService, verifyMiddleWare } from '../../../../services/base.service';
import { ConferenceService } from '../../../../services/conference.service';
import { Md2Toast } from '../../../../common/toast/toast';
import * as moment from 'moment';

@Component({
  selector: 'app-update-distribution',
  templateUrl: './update-distribution.component.html',
  styleUrls: ['./update-distribution.component.scss']
})
export class UpdateDistributionComponent implements OnInit {
  seasons: any[];
  years = [2018, 2019, 2020];

  data = {
    year: undefined,
    term: undefined,
    beginDate: undefined,
    endDate: undefined,
    remark: undefined,
    id: undefined,
  };
  constructor(private _activatedRoute: ActivatedRoute,
              private _baseService: BaseService,
              private _conferenceService: ConferenceService,
              private _route: Router,
              private _toast: Md2Toast) {
    this._baseService.getAllTerms().subscribe(v => this.seasons = (v));
    this._activatedRoute.params.subscribe(params => {
      if (Boolean(params['id'])) {
        this._conferenceService.getDistributionById(params['id']).subscribe(result => {
          this.data = {
            id: result.id || undefined,
            year: result.year || undefined,
            term: result.term || undefined,
            beginDate: result.beginDate ? moment(result.beginDate).format() : undefined,
            endDate: result.endDate ? moment(result.endDate).format() : undefined,
            remark: result.remark || undefined,
          };
        });
      }
    });
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
    this._conferenceService.updateDistribution(data).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('修改成功', 1800);
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
