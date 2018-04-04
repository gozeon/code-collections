import { API_V1 } from './api.config';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { verifyMiddleWare } from './base.service';

@Injectable()
export class EeoService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/eeo/v1',
    });
  }

  /**
   * 获取课节查询直播、回放地址
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=269
   * @param data
   * @returns {Observable<any>}
   */
  getPlayback(data): Observable<any> {
    return this._http.post(`${API_V1}/eeo/v1/class_video?courseId=${data.courseId}&classId=${data.classId}`, {})
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {});
  }
}
