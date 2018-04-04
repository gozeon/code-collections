import { API_V1 } from './api.config';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { verifyMiddleWare } from './base.service';
import { Response } from '@angular/http';

@Injectable()
export class StudentService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/interactive/v1',
    });
  }

  /**
   * 学生班级
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=290
   * @param data
   * @returns {Observable<any>}
   */
  getAllClass(data): Observable<any> {
    return this._http.post(`${API_V1}/classinfo/v1/class/query`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 学生课时
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=291
   * @param data
   * @returns {Observable<any>}
   */
  getAllLesson(data): Observable<any> {
    return this._http.post(`${API_V1}/studentlesson/v1/lesson/query`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 外教评语
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=292
   * @param data
   * @returns {Observable<any>}
   */
  getComments(data): Observable<any> {
    return this._http.post(`${API_V1}/comments/v1/student/comment`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {});
  }

  /**
   * 学生作业记录列表
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=263
   * @param data
   * @returns {Observable<any>}
   */
  getStudentHomeWorkRecord(data): Observable<any> {
    return this._http.get(`${API_V1}/studentHomework/v1/list`, {params: data})
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  /**
   * 配音记录列表
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=253
   * @param data
   * @returns {Observable<any>}
   */
  getVoiceRecording(data): Observable<any> {
    return this._http.get(`${API_V1}/homeworkRecord/v1/list`, {params: data})
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }
}
