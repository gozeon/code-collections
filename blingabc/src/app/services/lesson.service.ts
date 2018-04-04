import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';

const LESSON_URL: string = `${API_V1}/lesson/v1`;

export interface FliterLessonOption {
  name?: string;
  level?: string;
  term?: string;
  courseType?: string;
  page: number;
  size: number;
}

export interface Lesson {
  name: string;
  vocabulary?: string;
  grammar?: string;
  sentence?: string;
  level?: string;
  term?: string;
  courseType?: string;
  lessonNum?: string;
  isTestCourse?: string;
  whenLong?: string;
  status?: string;
}

/**
 * API文档 --> 课时 (http://120.27.11.200/)
 */
@Injectable()
export class LessonService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/general',
    });
  }

  // 课时列表
  getAllLessons(fliterLessonOption: FliterLessonOption): Observable<any> {
    return this._http.post(`${LESSON_URL}/lessons`, fliterLessonOption)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : { list: [], total: 0});
  }

  // 添加课时内容
  createLesson(lesson: any): Observable<any> {
    return this._http.post(`${LESSON_URL}/insert`, lesson)
      .map((res: Response) => verifyMiddleWare(res.json()) ? { code: 200 } : res.json());
  }

  // 查询一个课时内容
  getLessonById(id: number): Observable<any> {
    return this._http.get(`${LESSON_URL}/lessons/${id}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : { list: [], total: 0});
  }

  // 更新课时内容
  updateLessonById(data): Observable<any> {
    return this._http.post(`${LESSON_URL}/update`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? { code: 200 } : res.json());
  }

  // 发布课时
  publishLesson(id: number, lesson: any): Observable<any> {
    return this._http.post(`${LESSON_URL}/update/state`, Object.assign({ id: id }, lesson))
      .map((res: Response) => verifyMiddleWare(res.json()) ? { code: 200 } : res.json());
  }

  // 删除课时
  deleteLessonById(id: number): Observable<boolean> {
    return this._http.post(`${LESSON_URL}/delete/${id}`, {})
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 删除课时附件
  deleteLessonResources(id, type): Observable<boolean> {
    return this._http.post(`${LESSON_URL}/deleteFile?id=${id}&type=${type}`, {})
      .map((res: Response) => verifyMiddleWare(res.json()));
  }
}
