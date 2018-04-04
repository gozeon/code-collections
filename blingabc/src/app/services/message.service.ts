import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';

/**
 * API文档 -->
 */
@Injectable()
export class MessageService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/general',
    });
  }

  /**
   * 模板列表带分页
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=40
   * @param parm
   * @returns {Observable<any[]>}
   */
  getSmsTemplateList(parm: any): Observable<any> {
    return this._http.post(`${API_V1}/general/smstemplate/v1/smstemplate_list`, parm)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : { list: [], total: 0});
  }

  /**
   * 单条发送
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=56
   * @param data
   * @returns {Observable<any>}
   */
  sendMessageSingle(data: any): Observable<any> {
    return this._http.post(`${API_V1}/general/smstemplate/v1/send`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  getSmstemplatehistory(parm: any): Observable<any[]> {
    return this._http.get(`${API_V1}/smsLog/v1/sms_list_page?${this.objToParm(parm)}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }


  objToParm(obj: any) {
    const parmArr = [];
    for (const key in obj) {
      parmArr.push(`${key}=${obj[key]}`);
    }
    return parmArr.join('&');
  }
}
