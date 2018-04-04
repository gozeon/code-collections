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
export class OrderService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/general',
    });
  }
  // 订单列表 
  getOrderlist(parm: any): Observable<any[]> {
    return this._http.get(`${API_V1}/order/v1/order_list_page?${this.objToParm(parm)}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }
  // 物流列表
  getOrderLogistics(parm: any): Observable<any[]> {
    return this._http.get(`${API_V1}/orderLogistics/v1/orderLogistics_list_page?${this.objToParm(parm)}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }
  // 订单详情 
  getOrderdetail(id: any): Observable<any[]> {
    return this._http.get(`${API_V1}/order/v1/order?orderCode=${id}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }

  // 订单审核
  postOrderCheck(parm: any): Observable<any> {
    return this._http.post(`${API_V1}/order/v1/check`, parm)
      .map((res: Response) => res.json());
  }
  // 物流-更新
  postupdatelog(parm: any): Observable<any> {
    return this._http.post(`${API_V1}/orderLogistics/v1/update_orderLogistics`, parm)
      .map((res: Response) => res.json());
  }
  // 创建订单/订单提交
  createOrder(parm: any): Observable<any> {
    return this._http.post(`${API_V1}/order/v1/create`, parm)
      .map((res: Response) => res.json());
  }
  // 渠道列表接口
  getchanneList(parm): Observable<any[]> {
    return this._http.get(`${API_V1}/general/v1/channels?pid=${parm}`)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }
  // 计算课程优惠价格
  caleCourseFavourablePrice(parm: any): Observable<any> {
    return this._http.post(`${API_V1}/order/v1/caleCourseFavourablePrice`, parm)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  }


  // 创建订单/订单提交
  // createOrder(parm): Observable<any> {
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/x-www-form-urlencoded');
  //   return this._http.post(`${API_V1}/order/v1/create`, parm,{headers:headers}
  //   ).map((res: Response) => verifyMiddleWare(res.json()) ? res.json()['data'] : []);
  // }

  objToParm(obj: any) {
    let parmArr = [];
    for (let key in obj) {
      parmArr.push(`${key}=${obj[key]}`)
    }
    return parmArr.join('&');
  }

}
