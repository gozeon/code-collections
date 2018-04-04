import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Headers, Response } from '@angular/http';
import { IHttpInterceptor } from '@covalent/http';
import { verifyMiddleWare } from '../base.service';
import { TdLoadingService } from '@covalent/core';
import { Md2Toast } from '../../common/toast/index';
import { Router } from '@angular/router';
import { API_V1 } from '../api.config';

@Injectable()
export class CustomInterceptor implements IHttpInterceptor {
  constructor(private _toast: Md2Toast,
              private _loadingService: TdLoadingService,
              private _router: Router) {
  }

  onRequest(requestOptions: RequestOptionsArgs): RequestOptionsArgs {
    if (requestOptions.url === `${API_V1}/crmadmin/v1/login`) {
      requestOptions = Object.assign({}, requestOptions, {
        headers: new Headers({'authorization': 'dd34e0ff4e10a1d3b9428589369138e0'})
      });
    } else {
      requestOptions = Object.assign({}, requestOptions, {
        headers: new Headers({'authorization': JSON.parse(localStorage.getItem('info')).token})
      });
    }

    return requestOptions;
  }

  onRequestError(requestOptions: RequestOptionsArgs): RequestOptionsArgs {
    return requestOptions;
  }

  onResponse(response: Response): Response {
    if (response.json().code === '190001') {
      if (response.json().hasOwnProperty('data')) {
        this._toast.show(response.json().data, 1800);
      } else {
        this._toast.show(response.json().msg, 1800);
      }
      // localStorage.clear();
      this._router.navigate(['/login']);
    }
    if (!verifyMiddleWare(response.json())) {
      if (response.json().hasOwnProperty('data')) {
        this._toast.show(response.json().data, 1800);
      } else {
        this._toast.show(response.json().msg, 1800);
      }
    }
    return response;
  }

  onResponseError(error: Response): Response {
    this._loadingService.resolveAll();
    this._toast.show(error.toString(), 1800);
    return error;
  }
}
