import { Injectable } from '@angular/core';
import { Response, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';
import * as moment from 'moment';

const FOREIGN_URL = `${API_V1}/foreign/foreignTeacher/v1`;

interface FliterOption {
  page: number;
  size: number;
  id?: number;
  name?: string;
  startDate?: string;
  endDate?: string;
  phone?: string;
  email?: string;
  interviewStatus?: string;
  skypeId?: string;
  appStartDate?: string;
  appEndDate?: string;
}

/**
 * API文档 --> 外教 (http://120.27.11.200/)
 */
@Injectable()
export class ForeignTeacherService extends RESTService<any> {
  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/foreign/foreignTeacher/v1',
    });
  }

  // 获取外教
  getAllForeignTeacher(fliterOption: FliterOption): Observable<any> {
    return this._http.post(`${FOREIGN_URL}/foreignTeacher_list_page`, fliterOption)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 外教详情
  getForeignTeacherById(id: number): Observable<any> {
    return this._http.get(`${FOREIGN_URL}/foreignTeacher_detail`, {params: {id: id}})
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 获取外教+班主任
  getAllTeacher(fliterOption: FliterOption): Observable<any> {
    return this._http.post(`${API_V1}/foreign/headmaster/v1/teachers_list_page`, fliterOption)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 外教-新增
  createForeignTecher(teacher: any): Observable<any> {
    return this._http.post(`${FOREIGN_URL}/create`, teacher)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  // 外教-修改
  updateForeignTecher(id, teacher: any): Observable<any> {
    return this._http.post(`${FOREIGN_URL}/update`, Object.assign({}, {id: id}, teacher))
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  // 外教课时信息
  getClasssByForeignTecherId(filter: FliterOption): Observable<any> {
    return this._http.post(`${API_V1}/classinfo/v1/foreignTeacher`, filter)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json() : res.json());
  }

  // 外教课时信息
  getLessonsByForeignTecherId(filter: FliterOption): Observable<any> {
    return this._http.post(`${API_V1}/classinfo/v1/lessons/foreignTeacher`, filter)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json() : res.json());
  }

  // 获取全部在职外教
  getForeignTeacherOnDutyWithClass(): Observable<any> {
    return this._http.get(`${FOREIGN_URL}/foreignTeacher_list_all`, {
      params: {
        jobStatus: 1,
        dutyStatus: 1,
        teacherStatus: 1
      }
    })
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : res.json());
  }

  // 获取简历申请教师
  getAllProcessTeachers(ops: FliterOption): Observable<any> {
    return this._http.post(`${FOREIGN_URL}/application_process_list_page`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : res.json());
  }

  // 外教launch操作
  updateProcessTeachersLaunch(data: any): Observable<any> {
    return this._http.post(`${FOREIGN_URL}/launch`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  // 外教课时信息
  getAllClassWithForeignTeacher(ops): Observable<any> {
    return this._http.post(`${API_V1}/classinfo/v1/lessons/foreignTeacher`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 外教工资列表-分页
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=228
   * @param ops
   * @returns {Observable<any>}
   */
  getAllFinance(ops): Observable<any> {
    return this._http.post(`${API_V1}/foreign/fee/v1/foreignFee_list_page`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 外教工资记录insert操作
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=259
   * @param data
   * @returns {Observable<any>}
   */
  financeInsert(data): Observable<any> {
    return this._http.post(`${API_V1}/foreign/fee/v1/insert`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 外教工资log列表-分页
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=258
   * @param data
   * @returns {Observable<any>}
   */
  getAllInsertLog(data): Observable<any> {
    return this._http.post(`${API_V1}/foreign/fee/v1/foreignFee_log_list_page`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : res.json());
  }

  /**
   * 外教工资complete
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=256
   * @param data
   * @returns {Observable<any>}
   */
  updateFinanceStatus(data): Observable<any> {
    return this._http.post(`${API_V1}/foreign/fee/v1/foreignFee_complete`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 班级课时修改外教
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=237
   * @param ops
   * @returns {Observable<any>}
   */
  updateTeacherWithLesson(ops): Observable<any> {
    return this._http.post(`${API_V1}/classlesson/v1/change/foreignteacher`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 外教工资列表导出
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=278
   * @param data
   * @returns {Observable<any>}
   */
  exportExcel(feeDate, teacherName = '') {
    this._http.get(`${API_V1}/export/v1/foreignFee?feeDate=${feeDate}&teacherName=${teacherName}`, {
      responseType: ResponseContentType.Blob
    }).subscribe(res => {
      // window.open(URL.createObjectURL(res.blob()));
      const a = document.createElement('a');
      a.href = URL.createObjectURL(res.blob());
      a.style.display = 'none';
      a.download = `${moment(feeDate, 'x').format('YYYY-MM')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
    // const url = `${API_V1}/export/v1/foreignFee?feeDate=${feeDate}&teacherName=${teacherName}`;
    // const xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState === XMLHttpRequest.DONE) {
    //     // const a = document.createElement('a');
    //     // a.href =  URL.createObjectURL(xhr.response);
    //     // a.style.display = 'none';
    //     // a.download = 'text.xls';
    //     // document.body.appendChild(a);
    //     // a.click();
    //     // a.remove();
    //     window.open(URL.createObjectURL(xhr.response));
    //     // const blob = new Blob([xhr.response], {type: ''});
    //     // const urll = URL.createObjectURL(xhr.response);
    //     // window.open(urll);
    //   }
    // }
    // xhr.open('GET', url, true);
    // xhr.responseType = 'blob';
    // xhr.setRequestHeader('authorization', 'dd34e0ff4e10a1d3b9428589369138e0');
    // xhr.send(null);
    // window.open(`${API_V1}/export/v1/foreignFee?feeDate=${feeDate}&teacherName=${teacherName}&authorization=dd34e0ff4e10a1d3b9428589369138e0`);
  }
}
