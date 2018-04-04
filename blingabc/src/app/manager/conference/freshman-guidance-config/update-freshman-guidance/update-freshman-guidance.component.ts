import { Component, OnInit } from '@angular/core';
import { BaseService, verifyMiddleWare } from '../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { Md2Toast } from '../../../../common/toast';
import * as moment from 'moment';
import { FreshmanGuidanceService } from '../../../../services/freshman-guidance.service';

@Component({
  selector: 'app-update-freshman-guidance',
  templateUrl: './update-freshman-guidance.component.html',
  styleUrls: ['./update-freshman-guidance.component.scss']
})
export class UpdateFreshmanGuidanceComponent implements OnInit {
  mainUri = '/main/conference/freshman-guidance';
  years = [2018, 2019, 2020];
  seasons: any[];
  stages: any[];
  data = {
    id: undefined,
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
              private _FreshmanGuidanceService: FreshmanGuidanceService,
              private _activatedRoute: ActivatedRoute,) {
    this._baseService.getAllTerms().subscribe(v => this.seasons = (v));
    this._baseService.getAllStages().subscribe(v => this.stages = (v));
    this.initPage();
  }

  ngOnInit() {
  }

  initPage(): void {
    this._activatedRoute.params.subscribe(params => {
      if (Boolean(params['id'])) {
        this._FreshmanGuidanceService.getFreshmanGuidanceById(params['id']).subscribe(result => {
          if (verifyMiddleWare(result)) {
            const d = result.data;
            this.data = {
              id: d.id,
              year: +d.year,
              term: d.term,
              stage: d.stage,
              startDate: moment(d.startDate).format(),
              endDate: moment(d.endDate).format(),
              type: d.type,
            };
          }
        });
      }
    });
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

    this._FreshmanGuidanceService.updateFreshmanGuidance(data).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('修改成功', 1800);
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
