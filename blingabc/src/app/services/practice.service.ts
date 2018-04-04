import {Injectable} from '@angular/core';
import {HttpInterceptorService, RESTService} from '@covalent/http';
import {API_V1} from './api.config';
import {verifyMiddleWare} from './base.service';
import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';

const PRACTICE_URL = `${API_V1}/homeworkBookContent/v1`;

@Injectable()
export class PracticeService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/homeworkBookContent/v1'
    });
  }

  /**
   * 练习内容列表-分页
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=280
   * @param data
   * @returns {Observable<any[]>}
   */
  getAllPractices(data): Observable<any> {
    return this._http.post(`${PRACTICE_URL}/list_page`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 修改状态
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=283
   * @param id
   * @param status
   * @returns {Observable<any>}
   */
  updatePubStatus(id, status): Observable<any> {
    return this._http.post(`${PRACTICE_URL}/update`, {
      id: id,
      pubStatus: status,
      pubUsername: JSON.parse(localStorage.getItem('info')).name,
    })
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 练习内容-编辑
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=283
   * @param id
   * @param status
   * @returns {Observable<any>}
   */
  updatePractice(data): Observable<any> {
    return this._http.post(`${PRACTICE_URL}/update`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 练习内容-新增
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=282
   * @returns {Observable<any>}
   */
  addPractice(data): Observable<any> {
    return this._http.post(`${PRACTICE_URL}/insert`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 练习内容详情
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=281
   * @param id
   * @returns {Observable<any>}
   */
  getPracticeInfoById(id): Observable<any> {
    return this._http.get(`${PRACTICE_URL}/query/${id}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : res.json());
  }

  /**
   * 练习内容包上传
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=331
   * @param formData
   * @returns {Observable<any>}
   */
  uploadBookContent(formData): Observable<any> {
    return this._http.post(`${API_V1}/homeworkBookContent/v1/upload`, formData)
      .map((res: Response) => res.json());
  }
}
