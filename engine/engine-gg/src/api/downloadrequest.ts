// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Printable} from "../gg/base/printable";
import {Image} from "../gg/image";
import {API} from "./api";
import {uiPrint, uiPrintUrl} from "../global/print";
import {Hud} from "../global/hud";
import {Rectangle} from "../gg/geometry/rectangle";

/**
 * 下载时候使用的参数
 */
export interface DownloadOptions {
  name?: string; // 文件名
  scale?: number;
  crs?: string;
  region?: Rectangle;
  startAt?: Date;
  endAt?: Date;
}

/**
 * 下载的请求，当 print 的时候调用下载
 */
export class DownloadRequest implements Printable {
  private image_: Image;
  private options_: DownloadOptions;

  constructor(image: Image, options: DownloadOptions) {
    this.image_ = image;
    this.options_ = options;
  }

  onPrint(): void {
    Hud.show();

    API.getImageDownloadUrl(this.image_, this.options_).then((url: string) => {
      uiPrintUrl(url);
      Hud.hide();
    }).catch((error) => {
      Hud.hide();
      uiPrint(error);
    });
  }
}
