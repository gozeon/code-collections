import { verifyMiddleWare } from './base.service';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';
import { API_V1 } from './api.config';

const FILE_URL = `${API_V1}/file/v1`;
/**
 * API文档 --> 基础项 (http://120.27.11.200/)
 */
@Injectable()
export class FileService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: API_V1, // NOTE: baseUrl not work
      path: '/file/v1',
    });
  }

  uploadPublicRead(formData: FormData): Observable<any> {
    return this._http.post(`${FILE_URL}/oss/upload/publicRead`, formData)
      .map((res: Response) => verifyMiddleWare(res.json()) ? res.json() : res.json());
  }
}
