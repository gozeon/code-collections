import { API_V1 } from './api.config';
import { Injectable } from '@angular/core';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { Observable } from 'rxjs/Observable';
import { verifyMiddleWare } from './base.service';
import { Response } from '@angular/http';

const FRESHMANGUIDANCE_URL = `${API_V1}/classNoticeConfig/v1`;

@Injectable()
export class FreshmanGuidanceService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/classNoticeConfig/v1'
    });
  }

  /**
   * 列表查询
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=341
   * @param data
   * @returns {Observable<any[]>}
   */
  getAllFreshmanGuidances(data): Observable<any> {
    return this._http.post(`${FRESHMANGUIDANCE_URL}/configs`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 新增
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=337
   * @returns {Observable<any>}
   */
  addFreshmanGuidance(data): Observable<any> {
    return this._http.post(`${FRESHMANGUIDANCE_URL}/save`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 新增
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=337
   * @returns {Observable<any>}
   */
  getFreshmanGuidanceById(id): Observable<any> {
    return this._http.get(`${FRESHMANGUIDANCE_URL}/config/${id}`)
      .map((res: Response) => res.json());
  }

  /**
   * 更新
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=338
   * @returns {Observable<any>}
   */
  updateFreshmanGuidance(data): Observable<any> {
    return this._http.post(`${FRESHMANGUIDANCE_URL}/update`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 删除
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=339
   * @returns {Observable<any>}
   */
  deleteFreshmanGuidanceById(id): Observable<any> {
    return this._http.get(`${FRESHMANGUIDANCE_URL}/delete/${id}`)
      .map((res: Response) => res.json());
  }
}
