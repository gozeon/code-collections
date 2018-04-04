import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';
import { verifyMiddleWare } from './base.service';
const CRM_USER_URL: string = `${API_V1}/crmadmin/v1`;

export interface FilterOps {
  page: number;
  size: number;
  id?: number;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  headImg?: string;
  status?: number;
  delStatus?: number;
}

export interface user {
  id: number;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: number;
  delStatus?: number;
}

export interface newUser {
  username: string;
  name: string;
  phone: number;
  status: number;
}

/**
 * API文档 --> CRM后台用户
 */
@Injectable()
export class CRMUserService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/crmadmin/v1',
    });
  }

  // 重置密码
  resetPasswordById(id: number): Observable<boolean> {
    return this._http.post(`${CRM_USER_URL}/reset_pass`, { id: id })
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 修改CRM用户
  updateCRMUserById(user: user): Observable<boolean> {
    return this._http.post(`${CRM_USER_URL}/edit_user`, user)
      .map((res: Response) => verifyMiddleWare(res.json()));
  }

  // 用户列表
  getAllUsers(ops: FilterOps): Observable<any> {
    return this._http.get(`${CRM_USER_URL}/admin_user_list_page`, { params: ops })
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : { list: [], total: 0});
  }

  // 创建用户
  createCRMUser(user: newUser): Observable<any> {
    return this._http.post(`${CRM_USER_URL}/create`, user)
      .map((res: Response) => verifyMiddleWare(res.json()) ? { code: 200 } : res.json());
  }

  // 批量删除
  deleteAll(ids: number[]): Observable<boolean> {
    return this._http.post(`${CRM_USER_URL}/remove_user_batch`, { ids: ids.join(',') })
      .map((res: Response) => verifyMiddleWare(res.json()))
  }

  // login
  login(data: any): Observable<any> {
    return this._http.post(`${CRM_USER_URL}/login`, data)
      .map((res: Response) => res.json())
  }
}
