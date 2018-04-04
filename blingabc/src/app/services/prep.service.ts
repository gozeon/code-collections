import { Injectable } from '@angular/core';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';
import { Observable } from 'rxjs/Observable';
import { Response, ResponseContentType } from '@angular/http';
import * as moment from 'moment';

const PREP_URL = `${API_V1}/preview/v1`;
const PREP_CONTENT_URL = `${API_V1}/previewContent/v1`;

@Injectable()
export class PrepService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/preview/v1'
    });
  }

  /**
   * 预习列表-分页
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=230
   * @param data
   * @returns {Observable<any[]>}
   */
  getAllPreviews(data): Observable<any> {
    return this._http.post(`${PREP_URL}/list_page`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 预习-新增
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=231
   * @param data
   * @returns {Observable<any>}
   */
  createPreview(data): Observable<any> {
    return this._http.post(`${PREP_URL}/insert`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 修改
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=233
   * @param data
   * @returns {Observable<any>}
   */
  updatePreview(data): Observable<any> {
    return this._http.post(`${PREP_URL}/update`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 修改状态
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=233
   * @param id
   * @param pubStatus
   * @returns {Observable<any>}
   */
  updatePubStatus(id, pubStatus): Observable<any> {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('pubStatus', pubStatus);
    formData.append('pubUsername', JSON.parse(localStorage.getItem('info')).name);
    return this._http.post(`${PREP_URL}/update`, formData)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 预习-发布
   * @param {any[]} ids
   * @returns {Observable<any>}
   */
  publishAll(ids: any[]): Observable<any> {
    const data = Object.assign({}, {
      pubStatus: 1,
      pubUsername: JSON.parse(localStorage.getItem('info')).name,
      ids: ids
    });
    return this._http.post(`${PREP_URL}/publish`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 学生预习内容列表
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=261
   * @param previewId
   * @param studentNum
   * @returns {Observable<any>}
   */
  getPrepContent(previewId): Observable<any> {
    return this._http.get(`${PREP_CONTENT_URL}/list`, {
      params: {
        previewId: previewId
      }
    })
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : res.json());
  }

  /**
   * 预习-重新上传
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=232
   * @param previewId
   * @param content
   * @returns {Observable<any>}
   */
  reSetPrepContent(previewId, content): Observable<any> {
    return this._http.post(`${PREP_URL}/upload/${previewId}`, content)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  export(startAt, endAt) {
    this._http.get(`${API_V1}/export/v1/export_preview?begin=${+startAt}&end=${+endAt}`, {
      responseType: ResponseContentType.Blob
    }).subscribe(res => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(res.blob());
      a.style.display = 'none';
      a.download = `${moment(startAt, 'x').format('YYYY/MM/DD')}-${moment(endAt, 'x').format('YYYY/MM/DD')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }
}
