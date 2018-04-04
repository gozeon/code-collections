import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';

const COURSE_URL: string = `${API_V1}/course/v1`;

export interface FliterCourseOption {
  courseName?: string;
  level?: string;
  term?: string;
  courseType?: string;
  page: number;
  size: number;
}

export interface Course {
  courseName: string;
  courseDescribe: string;
  level: string;
  term: string;
  courseType: string;
  state: string;
  courseLessonList: CourseLesson[];
}

export interface CourseLesson {
  lessonId: number;
  lessonName: string;
  seq: number
}

/**
 * API文档 --> 课程 (http://120.27.11.200/)
 */
@Injectable()
export class CourseService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/course/v1',
    });
  }

  // 查询课程列表
  getAllCourse(fliterCourseOption: FliterCourseOption): Observable<any> {
    return this._http.post(`${COURSE_URL}/courses`, fliterCourseOption)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : { list: [], total: 0});
  }

  // 添加课程内容
  createCourse(course: Course): Observable<boolean> {
    return this._http.post(`${COURSE_URL}/insert`, course)
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 查询一个课程内容
  getCourseById(id: number): Observable<any> {
    return this._http.get(`${COURSE_URL}/courses/${id}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : { list: [], total: 0});
  }

  // 更新课程内容
  updateCourseByid(id: number, course: Course): Observable<boolean> {
    return this._http.post(`${COURSE_URL}/update`, Object.assign({ id: id }, course))
      .map((res: Response) => verifyMiddleWare(res.json()))
  }

  // 批量发布课程
  publishAll(ids: number[]): Observable<boolean> {
    return this._http.post(`${COURSE_URL}/batch/release?ids=${ids.join(',')}`, {})
      .map((res: Response) => verifyMiddleWare(res.json()))
  }

  // 删除课程
  deleteCourseById(id: number): Observable<boolean> {
    return this._http.post(`${COURSE_URL}/delete/${id}`, {})
      .map((res: Response) => verifyMiddleWare(res.json()))
  }
}
