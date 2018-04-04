import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';

const CONFERENCE_URL = `${API_V1}/conference/v1`;

/**
 * API文档 --> 发布会 (http://120.27.11.200/)
 */
@Injectable()
export class ConferenceService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/conference/v1',
    });
  }

  // 发布会信息列表
  getAllConferences(page: number, size: number): Observable<any> {
    return this._http.get(`${CONFERENCE_URL}/conferences`, {params: {page: page, size: size}})
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 批量无效
  cnacelConferences(ids: number[]): Observable<boolean> {
    return this._http.post(`${CONFERENCE_URL}/invalidBatch`, ids)
      .map((res: Response) => verifyMiddleWare(res.json()))
  }

  // 新增发布会信息
  createConferences(data: any): Observable<any> {
    return this._http.post(`${CONFERENCE_URL}/save`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 发布会设置列表
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=238
   * @returns {Observable<any>}
   */
  getAllConferenceWithGrab(): Observable<any> {
    return this._http.get(`${API_V1}/pro/v1/list`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  /**
   * 添加发布会
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=239
   * @param data
   * @returns {Observable<any>}
   */
  addConferenceWithGrab(data): Observable<any> {
    return this._http.post(`${API_V1}/pro/v1/save`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 更新发布会
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=240
   * @param data
   * @returns {Observable<any>}
   */
  updateConferenceWithGrab(data): Observable<any> {
    return this._http.post(`${API_V1}/pro/v1/update`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 删除发布会设置
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=242
   * @param data
   * @returns {Observable<any>}
   */
  deleteConferenceWithGrab(id): Observable<any> {
    return this._http.get(`${API_V1}/pro/v1/delete/${id}`)
      .map((res: Response) => res.json());
  }

  /**
   * 续报配置列表
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=300
   * @param data
   * @returns {Observable<any>}
   */
  getAllRenewal(data): Observable<any> {
    return this._http.post(`${API_V1}/resubmit/v1/resubmits`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 续报配置新增
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=298
   * @param data
   * @returns {Observable<any>}
   */
  addRenewal(data): Observable<any> {
    return this._http.post(`${API_V1}/resubmit/v1/save`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 续报配置详情查询
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=299
   * @param id
   * @returns {Observable<any>}
   */
  getRenewalById(id): Observable<any> {
    return this._http.get(`${API_V1}/resubmit/v1/resubmit/${id}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {});
  }

  /**
   * 续班配置更新
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=302
   * @param data
   * @returns {Observable<any>}
   */
  updateRenewal(data): Observable<any> {
    return this._http.post(`${API_V1}/resubmit/v1/update`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 续班配置发布
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=303
   * @param id
   * @param state
   * @returns {Observable<any>}
   */
  changeRenewalState(id, state): Observable<any> {
    return this._http.post(`${API_V1}/resubmit/v1/state/update`, {
      id: id,
      state: state
    })
      .map((res: Response) => res.json());
  }

  /**
   * 续报配置删除
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=317
   * @param id
   * @returns {Observable<any>}
   */
  deleteRenewalById(id): Observable<any> {
    return this._http.get(`${API_V1}/resubmit/v1/delete/${id}`)
      .map((res: Response) => res.json());
  }

  /**
   * 分销配置列表
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=327
   * @param data
   * @returns {Observable<any>}
   */
  getAllDistribution(data): Observable<any> {
    return this._http.post(`${API_V1}/distribution/config/v1/configs`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 分销配置新增
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=322
   * @param data
   * @returns {Observable<any>}
   */
  addDistribution(data): Observable<any> {
    return this._http.post(`${API_V1}/distribution/config/v1/save`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 分销配置发布
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=326
   * @param id
   * @param state
   * @returns {Observable<any>}
   */
  changeDistributionState(id): Observable<any> {
    return this._http.get(`${API_V1}/distribution/config/v1/publish/${id}`)
      .map((res: Response) => res.json());
  }

  /**
   * 分销配置删除
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=323
   * @param id
   * @returns {Observable<any>}
   */
  deleteDistributionById(id): Observable<any> {
    return this._http.get(`${API_V1}/distribution/config/v1/delete/${id}`)
      .map((res: Response) => res.json());
  }

  /**
   * 分销配置详情
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=325
   * @param id
   * @returns {Observable<any>}
   */
  getDistributionById(id): Observable<any> {
    return this._http.get(`${API_V1}/distribution/config/v1/config/${id}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {});
  }

  /**
   * 分销配置更新
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=324
   * @param data
   * @returns {Observable<any>}
   */
  updateDistribution(data): Observable<any> {
    return this._http.post(`${API_V1}/distribution/config/v1/update`, data)
      .map((res: Response) => res.json());
  }
}
