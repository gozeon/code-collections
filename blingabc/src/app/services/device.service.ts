import { API_V1 } from './api.config';
import { Injectable } from '@angular/core';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { Observable } from 'rxjs/Observable';
import { verifyMiddleWare } from './base.service';
import { Response } from '@angular/http';

const DEVICETASK_URL = `${API_V1}/devicetask/v1`;

@Injectable()
export class DeviceService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/devicetask/v1'
    });
  }

  /**
   * 设备检测任务列表
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=357
   * @param data
   * @returns {Observable<any[]>}
   */
  getAllDeviceTasks(data): Observable<any> {
    return this._http.post(`${DEVICETASK_URL}/select`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 新学员目录
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=366
   * @param data
   * @returns {Observable<any[]>}
   */
  getAllNewStudents(data): Observable<any> {
    return this._http.post(`${DEVICETASK_URL}/select/newstudent`, data)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : {list: [], total: 0});
  }

  /**
   * 新建设备检测任务
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=354
   * @returns {Observable<any>}
   */
  addDeviceTask(data): Observable<any> {
    return this._http.post(`${DEVICETASK_URL}/addtask`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 更新设备检测任务
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=354
   * @returns {Observable<any>}
   */
  updateDeviceTask(data): Observable<any> {
    return this._http.post(`${DEVICETASK_URL}/updatetask`, data)
      .map((res: Response) => res.json());
  }

  /**
   * 根据手机号查询设备详情
   * @link http://showdoc.blingabc.com/index.php?s=/2&page_id=353
   * @returns {Observable<any>}
   */
  getDeviceTaskDeatilByPhone(phone): Observable<any> {
    return this._http.get(`${DEVICETASK_URL}/detail/${phone}`)
      .map((res: Response) => res.json());
  }
}
