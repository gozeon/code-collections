import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';

const TEMPLATE_URL = `${API_V1}/template/v1`;
const CLASS_INFO_URL = `${API_V1}/classinfo/v1`;
const CLASS_TRANSFER_URL = `${API_V1}/classTransfer/v1`;
const CLASS_QUIT_URL = `${API_V1}/classQuit/v1`;

export interface FilterClassTMPOption {
  name?: string;
  level?: number;
  term?: number;
  courseType?: number;
  schoolTimeId?: number;
  page: number;
  size: number;
}

export interface FilterClassOption {
  className?: string;
  level?: number;
  term?: number;
  courseType?: number;
  schoolTimeId?: number;
  distribution?: number;
  classCode?: string;
  foreignTeacherName?: string;
  classStartDate?: number; // 原型没有
  classEndDate?: number; // 原型没有
  year?: number; // 原型没有
  page: number;
  size: number;
}

export interface ClassTemplate {
  courseId: number;
  schoolTimeId?: number;
  livePrice?: number;
  liveContain?: number;
  freeLesson?: number;
  sendMaterial?: number;
  classLabel?: number;
  classStartDate?: number;
}

export interface OpenClassOps {
  livePrice: number;
  freeLesson: number;
  liveContain: number;
  schoolTimeId: number;
  classLabel: number;
  templateId: number;
  sendMaterial: number;
  classStartDate: string;
  foreignIds?: number[];
  quantity?: number;
}

export interface FilterClassRecordOps {
  stuNum: string;
  page: number;
  size: number;
}


export interface FilterClassTransferRecordOps {
  classCode?: string;
  telephone?: string;
  page: number;
  size: number;
}

export interface FilterClassTransferPendingOps {
  classCode?: string;
  level?: number;
  schoolTimeId?: number;
  page: number;
  size: number;
  fromClassCode: string;
  lessonNum: string;
}

/**
 * API文档 --> 课程模版 (http://120.27.11.200/)
 */
@Injectable()
export class ClassService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/template/v1',
    });
  }

  // 班级查询
  getAllClass(fliterClassOption: FilterClassOption): Observable<any> {
    return this._http.post(`${CLASS_INFO_URL}/classInfos`, fliterClassOption)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 查询一个班级
  getClassById(id: number): Observable<any> {
    return this._http.get(`${CLASS_INFO_URL}/classInfos/${id}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 修改班级信息
  updateClassInfo(data: any): Observable<any> {
    return this._http.post(`${CLASS_INFO_URL}/update`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  // 批量发布班级
  publishAllClass(ids: number[]): Observable<boolean> {
    return this._http.post(`${CLASS_INFO_URL}/batch/release?ids=${ids.join(',')}`, {})
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 批量修改班主任
  updateAllClassTeacher(classTeacherId: number, ids: number[]): Observable<boolean> {
    return this._http.post(`${CLASS_INFO_URL}/teacher/update`, {
      classTeacherId: classTeacherId,
      ids: ids
    }).map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 导出开班到分销
  updateAllClassDistribution(distributionId: number, ids: number[]): Observable<boolean> {
    return this._http.post(`${CLASS_INFO_URL}/batch/distribution`, {
      distribution: distributionId,
      ids: ids
    }).map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 模板开班
  createClassByTMP(openClassOps: OpenClassOps): Observable<any> {
    return this._http.post(`${CLASS_INFO_URL}/create`, openClassOps)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  // 查询班级模板
  getAllClassTemplate(fliterClassTMPOption: FilterClassTMPOption): Observable<any> {
    return this._http.post(`${TEMPLATE_URL}/templates`, fliterClassTMPOption)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 模板默认选项
  getAllTemplateDefault(courseTypeCode: number): Observable<any> {
    return this._http.get(`${TEMPLATE_URL}/default/${courseTypeCode}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 查询一个班级模板
  getTemplateById(id: number): Observable<any> {
    return this._http.get(`${TEMPLATE_URL}/templates/${id}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 添加班级模板
  createClassTemplate(classTemplate: ClassTemplate): Observable<any> {
    return this._http.post(`${TEMPLATE_URL}/insert`, classTemplate)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  // 删除一个模板
  deleteClassTemplate(id: number): Observable<boolean> {
    return this._http.post(`${TEMPLATE_URL}/delete/${id}`, {})
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 更新班级模板
  updateClassTemplateByid(id: number, classTemplate: ClassTemplate): Observable<any> {
    return this._http.post(`${TEMPLATE_URL}/update`, Object.assign({id: id}, classTemplate))
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  // 批量发布班级模板
  publishAll(ids: number[]): Observable<boolean> {
    return this._http.post(`${TEMPLATE_URL}/batch/release?ids=${ids.join(',')}`, {})
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 批量下架班级模板
  offShelvesAll(ids: number[]): Observable<boolean> {
    return this._http.post(`${CLASS_INFO_URL}/batch/offshelves?ids=${ids.join(',')}`, {})
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 根据模板id获取模板课时
  getTemplateLessonListById(templateId: number): Observable<any> {
    return this._http.get(`${API_V1}/templatelesson/v1/template/${templateId}`)
      .map((res: Response) => res.json());
  }

  // 学生班级列表
  getAllClassRecords(ops: FilterClassRecordOps): Observable<any> {
    return this._http.post(`${CLASS_INFO_URL}/stuClasses`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 转班记录列表
  getAllClassTransferRecords(ops: FilterClassTransferRecordOps): Observable<any> {
    return this._http.post(`${CLASS_TRANSFER_URL}/records`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 学生班级调转班次数
  getStudentTransferTimes(stuNum: string, fromClassCode: string): Observable<any> {
    return this._http.post(`${CLASS_TRANSFER_URL}/stuTransferTimes`, {
      stuNum: stuNum,
      fromClassCode: fromClassCode
    })
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : res.json());
  }

  // 待转班级列表
  getClassWithPending(ops: FilterClassTransferPendingOps): Observable<any> {
    return this._http.post(`${CLASS_TRANSFER_URL}/pending`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 提交转班
  transferClass(ops): Observable<any> {
    return this._http.post(`${CLASS_TRANSFER_URL}/transfer`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  /**
   * 特殊转班
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=227
   * @param ops any
   */
  transferClassWithSpecial(ops): Observable<any> {
    return this._http.post(`${CLASS_TRANSFER_URL}/transfer/special`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  // 待退班级信息
  getClassWithQuiting(ops): Observable<any> {
    return this._http.post(`${CLASS_QUIT_URL}/classInfo`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {code: 500});
  }

  // 计算价格
  calculatePriceWithQuit(ops): Observable<any> {
    return this._http.post(`${CLASS_QUIT_URL}/realPrice`, ops)
      .map((res: Response) => res.json());
  }

  // 退班
  quiteClass(ops): Observable<any> {
    return this._http.post(`${CLASS_QUIT_URL}/save`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? {code: 200} : res.json());
  }

  // 退班列表
  getQuiteClass(ops): Observable<any> {
    return this._http.post(`${CLASS_QUIT_URL}/quits`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 审核列表
  getQuiteClassWithVerifing(ops): Observable<any> {
    return this._http.post(`${CLASS_QUIT_URL}/quits/unreview`, ops)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 退班审核详情
  getQuiteClassWithVerifingById(id): Observable<any> {
    return this._http.get(`${CLASS_QUIT_URL}/quit/${id}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  // 提交审核退班
  reviewQuiteClass(ops): Observable<any> {
    return this._http.post(`${CLASS_QUIT_URL}/review`, ops)
      .map((res: Response) => res.json());
  }

  /**
   * 手动退款列表
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=368
   * @param data
   * @returns {Observable<any>}
   */
  getAllManualRefund(data): Observable<any> {
    return this._http.post(`${API_V1}/refundManul/v1/refunds`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 更新手动退费状态
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=369
   * @param data
   * @returns {Observable<any>}
   */
  changeManualRefundState(data): Observable<any> {
    return this._http.post(`${API_V1}/refundManul/v1/update/state`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 变更转账账号
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=370
   * @param data
   * @returns {Observable<any>}
   */
  changeAccount(data): Observable<any> {
    return this._http.post(`${API_V1}/refundManul/v1/update/account`, data)
      .map((res: Response) => res.json());
  }
}


const mock = JSON.parse(newFunction());

function newFunction(): string {
  return JSON.stringify({
    'id': null,
    'createDate': 1510900736632,
    'ifSpecial': null,
    'ifSpecialName': null,
    'stuNum': null,
    'stuName': null,
    'parentName': null,
    'telephone': null,
    'orderCode': '11201711153712870511',
    'orderDetailCode': '11201711153712870511001',
    'classId': 25767,
    'classCode': '18W1010L4036',
    'className': 'ceshike',
    'realPrice': 0.01,
    'shouldNumber': 1,
    'realNumber': 1,
    'refundAmount': 0.01,
    'submitter': null,
    'submitterName': null,
    'nextBeginDate': null,
    'reviewer': null,
    'reviewerName': null,
    'reviewDate': null,
    'reviewState': null,
    'reviewStateName': null,
    completedLessonss: [],
    'completedLessons': [
      {
        'id': null,
        'createDate': 1510900736632,
        'classQuitId': null,
        'ifQuit': 10,
        'orderLessonId': 26269,
        'lessonId': 548,
        'lessonNum': 1,
        'lessonName': '112',
        'lessonState': 20,
        'lessonStateName': '已结课',
        'stuLessonState': 10,
        'stuLessonStateName': '未开课',
        'beginDate': 1510653600000,
        'ifComplete': 10
      },
      {
        'id': null,
        'createDate': 1510900736632,
        'classQuitId': null,
        'ifQuit': 20,
        'orderLessonId': 26269,
        'lessonId': 549,
        'lessonNum': 1,
        'lessonName': '112',
        'lessonState': 20,
        'lessonStateName': '已结课',
        'stuLessonState': 10,
        'stuLessonStateName': '未开课',
        'beginDate': 1510653600000,
        'ifComplete': 10
      },
      {
        'id': null,
        'createDate': 1510900736632,
        'classQuitId': null,
        'ifQuit': 20,
        'orderLessonId': 26269,
        'lessonId': 550,
        'lessonNum': 1,
        'lessonName': '1123',
        'lessonState': 20,
        'lessonStateName': '已结课',
        'stuLessonState': 10,
        'stuLessonStateName': '未开课',
        'beginDate': 1510653600000,
        'ifComplete': 10
      }
    ],
    'unCompletedLessons': [
      {
        'id': null,
        'createDate': 1510900736632,
        'classQuitId': null,
        'ifQuit': 10,
        'orderLessonId': 26269,
        'lessonId': 333,
        'lessonNum': 1,
        'lessonName': '1442',
        'lessonState': 20,
        'lessonStateName': '已结课',
        'stuLessonState': 10,
        'stuLessonStateName': '未开课',
        'beginDate': 1510653600000,
        'ifComplete': 20
      },
      {
        'id': null,
        'createDate': 1510900736632,
        'classQuitId': null,
        'ifQuit': 10,
        'orderLessonId': 26269,
        'lessonId': 223,
        'lessonNum': 1,
        'lessonName': '1443',
        'lessonState': 20,
        'lessonStateName': '已结课',
        'stuLessonState': 10,
        'stuLessonStateName': '未开课',
        'beginDate': 1510653600000,
        'ifComplete': 20
      },
      {
        'id': null,
        'createDate': 1510900736632,
        'classQuitId': null,
        'ifQuit': 10,
        'orderLessonId': 26269,
        'lessonId': 123,
        'lessonNum': 1,
        'lessonName': '1231',
        'lessonState': 20,
        'lessonStateName': '已结课',
        'stuLessonState': 10,
        'stuLessonStateName': '未开课',
        'beginDate': 1510653600000,
        'ifComplete': 20
      }
    ]
  });
}
