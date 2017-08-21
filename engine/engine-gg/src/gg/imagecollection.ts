// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {GGObject, GGObjectType} from "./ggobject";
import {Typeutils} from "../utils/typeutils";
import {Rectangle} from "./geometry/rectangle";
import {API, ImageCollectionInfo} from "../api/api";
import {Hud} from "../global/hud";
import {uiPrint} from "../global/print";
import {Image} from "./image";
import {Printable} from "./base/printable";
import {engineContext} from "../base/context";

export interface CollectionFilter {
  start?: Date;
  end?: Date;
  region?: Rectangle;
  cloud?: number; // 0 - 100
  returnFirst?: boolean;
}

/**
 * 影像的时间序列
 */
export class ImageCollection extends GGObject implements Printable {
  type: GGObjectType = GGObjectType.IMAGE_COLLECTION;

  /**
   * 是否需要预先准备数据源
   * @type {boolean} true 如果是
   */
  shouldPrepare: boolean = false;

  clone(): ImageCollection {
    return Object.assign({}, this, ImageCollection.prototype, GGObject.prototype);
  }

  // ---------- Public Methods ----------

  /**
   * 过滤日期范围
   * @param {Date | string} start 起始日期
   * @param {Date | string} end 结束日期
   * @returns {ImageCollection} ImageCollection
   */
  filterDate(start: Date | string, end: Date | string): ImageCollection {
    const newImgCollection: ImageCollection = this.clone();

    newImgCollection.collectionFilter.start = this.parameterToDate_(start);
    newImgCollection.collectionFilter.end = this.parameterToDate_(end);

    return newImgCollection;
  }

  /**
   * 过滤范围
   * @param {Rectangle} bounds
   * @returns {ImageCollection}
   */
  filterBounds(bounds: Rectangle): ImageCollection {
    const newImgCollection: ImageCollection = this.clone();
    newImgCollection.collectionFilter.region = bounds;
    return newImgCollection;
  }

  /**
   * 过滤云量
   * @param {number} cloudCoverage 云量，范围为 0~100
   * @returns {ImageCollection}
   */
  filterCloud(cloudCoverage: number): ImageCollection {
    const newImgCollection: ImageCollection = this.clone();
    newImgCollection.collectionFilter.cloud = cloudCoverage;
    return newImgCollection;
  }

  /**
   * 准备数据，仅适用于高分等一些需要准备数据源的情况
   */
  prepare(email: string): void {
    if (this.shouldPrepare) {
      Hud.show();
      API.prepareImageCollection(this, email).then((numScenes: number) => {
        uiPrint(`需要下载的景数:${numScenes}；完成后请在邮箱${email}查收邮件`);
      }).catch((error) => {
        Hud.hide();
        uiPrint(error);
      });
    } else {
      uiPrint(`该数据不需要准备`);
    }
  }

  /**
   * 获取第一个图片
   * @returns {Image}
   */
  first(): Image {
    const image: Image = new Image(this.assetId);
    image.defaultVizParams = this.defaultVizParams;
    image.defaultDownloadOptions = this.defaultDownloadOptions;
    image.collectionFilter = this.collectionFilter;
    image.collectionFilter.returnFirst = true;
    return image;
  }

  private parameterToDate_(maybeDate: Date | string): Date {
    if (Typeutils.isString(maybeDate)) {
      if (maybeDate === "latest") {
        return new Date();
      }
      return new Date(<string>maybeDate);
    } else if (Typeutils.isObject(maybeDate)) {
      return <Date>maybeDate;
    }
  }

  onPrint(): void {
    engineContext.hudImpl.show();

    API.queryCollectionInfo(this).then((info: ImageCollectionInfo) => {
      engineContext.printImpl.print(info);
      engineContext.hudImpl.hide();
    }).catch((error) => {
      engineContext.printImpl.print(error);
      engineContext.hudImpl.hide();
    });
  }
}
