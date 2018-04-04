import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';

export const verifyMiddleWare = (res: any): boolean => {
  if (res.code === '10000' && res.msg === 'ok') {
    return true;
  } else {
    return false;
  }
}

/**
 * API文档 --> 基础项 (http://120.27.11.200/)
 */
@Injectable()
export class BaseService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/general',
    });
  }

  // 学期列表
  getAllDistributions(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/distribution/v1/distributions`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }
  // 分期列表
  getAllStages(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/stage/v1/stages`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }
  // 学期列表
  getAllTerms(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/term/v1/terms`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 课程等级列表
  getAllCourseLevel(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/course/v1/level`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 课程类型列表
  getAllCourseType(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/course/v1/type`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 发布状态
  getAllStates(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/template/v1/states`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 课程标签
  getAllClasslabels(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/course/v1/classlabels`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 渠道列表
  getAllChannels(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/channels`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 省份集合接口
  getAllProvinces(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/provinces`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 市集合接口
  getAllCitys(province_code: string): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/citys?province_code=${province_code}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 区集合接口
  getAllAreas(city_code: string): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/areas?city_code=${city_code}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 时间段查询
  getAllTimeslots(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/schooltime/v1/timeslots`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 时间查询
  getAllTime(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/schooltime/v1/query`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 添加时间管理
  createSchoolTime(schoolTime: string): Observable<boolean> {
    return this._http.post(`${API_V1}/general/schooltime/v1/insert/${schoolTime}`, {})
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 更新时间管理
  updateSchoolTime(id: number, schoolTime: string): Observable<boolean> {
    return this._http.post(`${API_V1}/general/schooltime/v1/update/${id}/${schoolTime}`, {})
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 国家列表
  getAllCountries(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/countries`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 州列表
  getAllStateByCountryId(countryId: number): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/states?countryId=${countryId}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // Region列表
  getAllRegionsByStateId(stateId: number): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/regions?stateId=${stateId}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 获取所有时区
  getAllTimeZone(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/timezone`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 国际区号列表
  getAllAreaCode(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/countryCode`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 大学列表
  getAllUniversities(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/universities`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 认证机构
  getAllCertificate(): Observable<any[]> {
    return this._http.get(`${API_V1}/foreign/foreignTeacher/v1/certificates`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 教学经验
  getAllExperience(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/teachingExperienceDic`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 学历
  getAllEducation(): Observable<any[]> {
    return this._http.get(`${API_V1}/foreign/foreignTeacher/v1/educations`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 来源 简历、获知
  getAllSources(): Observable<any[]> {
    return this._http.get(`${API_V1}/foreign/foreignTeacher/v1/sources`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 外教等级
  getAllForeignTeacherLevels(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/foreignLevels`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 面试状态
  getAllInterviewStatus(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/interviewStatus`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 面试失败原因
  getAllCauseOfFailure(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/interviewFailReasons`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  /**
   * 更换老师原因
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=226
   * @returns {Observable<any[]>}
   */
  getAllChangeForeignTeacherReasons(): Observable<any[]> {
    return this._http.get(`${API_V1}/general/changereason/v1/changereasons`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }
}
