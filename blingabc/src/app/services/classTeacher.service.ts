import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';

const TEACHER_URL = `${API_V1}/foreign/headmaster/v1`;

interface FliterOption {
  page: number;
  size: number;
  id?: number;
  name?: string;
}

export interface ClassTeacher {
  id?: number
  name: string;
  englishName: string;
  email: string;
  phone: string;
  sex: string;
  jobStatus: string;
  dutyStatus: string;
  contractStatus: string;
  birthday?: string;
  entryTime?: string;
}

/**
 * API文档 --> 外教
 */
@Injectable()
export class ClassTeacherService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/general',
    });
  }
  // 班主任-列表
  getALlClassTeacher(fliterOption: FliterOption): Observable<any> {
    return this._http.post(`${TEACHER_URL}/headmaster_list_page`, fliterOption)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 班主任-新增
  createClassTecher(classTeacher: ClassTeacher): Observable<any> {
    return this._http.post(`${TEACHER_URL}/create`, classTeacher)
      .map((res: Response) => verifyMiddleWare(res.json()) ? { code: 200 } : res.json());
  }

  // 班主任-更新
  updateClassTecher(classTeacher: ClassTeacher): Observable<any> {
    return this._http.post(`${TEACHER_URL}/update`, classTeacher)
      .map((res: Response) => verifyMiddleWare(res.json()) ? { code: 200 } : res.json());
  }

  // 获取班主任带班信息  --> NOTE: url是班级的url
  getTeacherClassInfo(fliterOption: FliterOption): Observable<any> {
    return this._http.post(`${API_V1}/classinfo/v1/headmaster`, fliterOption)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 班主任-批量修改带班状态
  updateDutyStatusAll(ids: number[], dutyStatus: number): Observable<boolean> {
    return this._http.post(`${TEACHER_URL}/update_duty_status_batch`, {
      ids: ids.join(','),
      dutyStatus: dutyStatus
    })
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 获取在职状态：在职，和带班状态：正常 的老师列表
  getTeacherOnDutyWithClass(): Observable<any[]> {
    return this._http.get(`${TEACHER_URL}/headmaster_list_all`, {
      params: {
        jobStatus: 1,
        dutyStatus: 1
      }
    })
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 班级-更改班主任
  updateClassInfoWithClassTeacher(ops): Observable<boolean> {
    return this._http.post(`${TEACHER_URL}/class_headmaster_change`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

}
