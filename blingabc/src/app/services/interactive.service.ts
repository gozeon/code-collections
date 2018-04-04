import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';
const INTERACTIVE_URL: string = `${API_V1}/interactive/v1`;

interface FilterOps {
  size: number;
  page: number;
  studentId?: number;
  studentNum?: number;
  datagramId?: number;
  dataId?: number;
}

/**
 * API文档 --> 互动课程
 */
@Injectable()
export class InteractiveService extends RESTService<any> {
  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/interactive/v1',
    });
  }

  // 学习记录列表-分页
  getAllLearnRecord(ops: FilterOps): Observable<any> {
    return this._http.post(`${INTERACTIVE_URL}/studylog_list_page`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : { list: [], total: 0});
  }

  // 资料包列表
  getAllInfoPkgs(): Observable<any> {
    return this._http.get(`${INTERACTIVE_URL}/datagram_list`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : { list: [], total: 0});
  }
}
