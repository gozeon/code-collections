import { Injectable } from '@angular/core';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

const HOMEWORK_URL = `${API_V1}/homework/v1`;
const HOMEWORK_CONTENT_URL = `${API_V1}/homeworkContent/v1`;

@Injectable()
export class HomeworkService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/homework/v1'
    });
  }

  /**
   * 作业列表-分页
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=244
   * @param data
   * @returns {Observable<any[]>}
   */
  getAllHomeWorks(data): Observable<any> {
    // Object.keys(data).forEach(key => (data[key] === null || data[key] === '') && delete data[key]);
    return this._http.post(`${HOMEWORK_URL}/list_page`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 作业-新增
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=245
   * @param data
   * @returns {Observable<any>}
   */
  createHomework(data): Observable<any> {
    return this._http.post(`${HOMEWORK_URL}/insert`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 修改状态
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=247
   * @param id
   * @param pubStatus
   * @returns {Observable<any>}
   */
  updatePubStatus(id, pubStatus): Observable<any> {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('pubStatus', pubStatus);
    formData.append('pubUsername', JSON.parse(localStorage.getItem('info')).name);
    return this._http.post(`${HOMEWORK_URL}/update`, formData)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   *  更新
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=247
   * @param data
   * @returns {Observable<any>}
   */
  updateHomework(data): Observable<any> {
    return this._http.post(`${HOMEWORK_URL}/update`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 作业-发布
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=273
   * @param data
   * @returns {Observable<any>}
   */
  publishAll(ids: any[]): Observable<any> {
    const data = Object.assign({}, {
      pubStatus: 1,
      pubUsername: JSON.parse(localStorage.getItem('info')).name,
      ids: ids
    });
    return this._http.post(`${HOMEWORK_URL}/publish`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 作业内容列表
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=248
   * @param homeworkId
   * @returns {Observable<any>}
   */
  getHomeworkContent(homeworkId): Observable<any> {
    return this._http.post(`${HOMEWORK_CONTENT_URL}/list`, {homeworkId: homeworkId})
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : res.json());
  }

  /**
   * 作业-重新导入
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=246
   * @param homeworkId
   * @param content
   * @returns {Observable<any>}
   */
  reSetHomeworkContent(homeworkId, content): Observable<any> {
    return this._http.post(`${HOMEWORK_URL}/upload/${homeworkId}`, content)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }
}
