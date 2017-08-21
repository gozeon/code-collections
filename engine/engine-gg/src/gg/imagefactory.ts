// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Image} from "./image";
import {SENTINEL} from "./image/sentinel";
import {ImageCollection} from "./imagecollection";
import {GF1WFV} from "./imagecollection/gf1";
import {SENTINEL2} from "./imagecollection/sentinel2";
import {MODIS} from "./imagecollection/modis";

export type ImageAssetId = "sentinel";
export type ImageCollectionAssetId = "sentinel-2" | "GF1/WFV" | "MODIS/051/MYD13Q1";

const IMAGE_PRODUCTS: Image[] = [SENTINEL];
const IMAGE_COLLECTION_PRODUCTS: ImageCollection[] = [GF1WFV, SENTINEL2, MODIS];

/**
 * 图像工厂类
 */
export class ImageFactory {

  /**
   * 根据 ID 生成 image
   */
  static image(assetId: ImageAssetId): Image {
    for (let image of IMAGE_PRODUCTS) {
      if (image.assetId === assetId) {
        return image;
      }
    }
  }

  /**
   * 根据 ID 生成 ImageCollection
   */
  static imageCollection(assetId: ImageCollectionAssetId): ImageCollection {
    for (let imageCollection of IMAGE_COLLECTION_PRODUCTS) {
      if (imageCollection.assetId === assetId) {
        return imageCollection;
      }
    }
  }
}
