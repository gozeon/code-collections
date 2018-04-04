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
export class UserService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/general',
    });
  }

  // 通过手机号搜索
  getParentInfo(parm): Observable<any[]> {
    return this._http.get(`${API_V1}/user/v1/parent_mobile?mobile=${parm}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 批量导入家长
  batchUploadParent(data): Observable<any> {
    return this._http.post(`${API_V1}/user/v1/batch_upload_parent`, data)
      .map((res: Response) => res.json());
  }

  // 修改家长信息
  updateParent(parm): Observable<any> {
    return this._http.post(`${API_V1}/user/v1/update_parent`, parm)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json() : []);
  }

  // 修改学生信息
  updateStudent(parm): Observable<any> {
    return this._http.post(`${API_V1}/user/v1/update_student`, parm)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json() : []);
  }

  // 获取学生优惠券
  getStudentCouponList(parm): Observable<any[]> {
    return this._http.get(`${API_V1}//user/v1/student_coupon_list/${parm}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 用户列表（学生）
  getstudentList(parm): Observable<any[]> {
    return this._http.get(`${API_V1}/user/v1/student_trace_list_page?${this.objToParm(parm)}`)
      .map((res: Response) => res.json());
  }

  // 渠道列表接口
  getchanneList(parm): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/channels?pid=${parm}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 创建家长
  createParent(parm): Observable<any> {
    return this._http.post(`${API_V1}/user/v1/registerByMobile`, parm)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json() : []);
  }

  /**
   * 家长重置密码
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=220
   * @param num
   * @returns {Observable<any>}
   */
  resetPasswordByParent(num): Observable<any> {
    return this._http.get(`${API_V1}/user/v1/reset_password/${num}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  objToParm(obj: any) {
    let parmArr = [];
    for (let key in obj) {
      parmArr.push(`${key}=${obj[key]}`)
    }
    return parmArr.join('&');
  }

}
