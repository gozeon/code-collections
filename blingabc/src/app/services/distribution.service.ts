import { API_V1 } from './api.config';
import { Injectable } from '@angular/core';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { Observable } from 'rxjs/Observable';
import { verifyMiddleWare } from './base.service';
import { Response, ResponseContentType } from '@angular/http';
import * as moment from 'moment';

@Injectable()
export class DistributionService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/outherTeacher/v1'
    });
  }

  /**
   * 列表-(包含账户信息)
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=350
   * @param data
   * @returns {Observable<any>}
   */
  getAllTeacherWithAccount(data): Observable<any> {
    return this._http.post(`${API_V1}/outherTeacher/v1/list_account_page`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 新增
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=335
   * @returns {Observable<any>}
   */
  addTeacher(data): Observable<any> {
    return this._http.post(`${API_V1}/outherTeacher/v1/insert`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 黑名单-分页
   * @returns {Observable<any>}
   */
  getAllWithdrawProhibited(data): Observable<any> {
    return this._http.post(`${API_V1}/teacherBlack/v1/list_page`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 新增
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=347
   * @param data
   * @returns {Observable<any>}
   */
  addWithdrawProhibited(data): Observable<any> {
    return this._http.post(`${API_V1}/teacherBlack/v1/insert`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 删除
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=349
   * @param id
   * @returns {Observable<any>}
   */
  deleteWithdrawProhibited(id): Observable<any> {
    return this._http.get(`${API_V1}/teacherBlack/v1/remove/${id}`)
      .map((res: Response) => res.json());
  }

  /**
   * 老师账户详情-分页
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=343
   * @param data
   * @returns {Observable<any>}
   */
  getAllTeacherAccount(data): Observable<any> {
    return this._http.post(`${API_V1}/teacherAccount/v1/detail_list_page`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 提现导入
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=375
   * @param data
   * @returns {Observable<any>}
   */
  importWithdraw(data): Observable<any> {
    return this._http.post(`${API_V1}/teacherAccount/v1/cash_upload`, data)
      .map((res: Response) => res.json());
  }


  /**
   * 批量导入
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=374
   * @param data
   * @returns {Observable<any>}
   */
  importWithdrawProhibited(data): Observable<any> {
    return this._http.post(`${API_V1}/teacherBlacklist/v1/upload`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 教师税导出
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=379
   * @param selectDate
   */
  exportWithdraw(selectDate) {
    this._http.get(`${API_V1}/teacherAccount/v1/report_tax?selectDate=${selectDate}`,{
      responseType: ResponseContentType.Blob
    }).subscribe(res => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(res.blob());
      a.style.display = 'none';
      a.download = `${selectDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

}
