import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';
import { Observable } from 'rxjs/Observable';

const TRACK_URL = `${API_V1}/studentTrace/v1`;

interface FilterOption {
  page: number;
  size: number;
  studentNum?: string;
  createCode?: string;
}


/**
 * API文档 --> 跟踪记录 (http://120.27.11.200/)
 */
@Injectable()
export class TrackService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/studentTrace/v1',
    });
  }

  // 用户跟踪-分页
  getAllTrackRecord(ops: FilterOption): Observable<any> {
    return this._http.get(`${TRACK_URL}/get_list_page`, {params: ops})
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : { list: [], total: 0});
  }

  // 用户跟踪-添加
  createTrackRecord(data): Observable<any> {
    return this._http.post(`${TRACK_URL}/insert`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  // 批量修改跟踪日期
  updateAllTrackTime(data: any): Observable<any> {
    return this._http.post(`${API_V1}/user/v1/batch_trace`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }
}
