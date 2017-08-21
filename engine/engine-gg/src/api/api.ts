// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ImageVisualizationParameters} from "../ui/map/types";
import {Image} from "../gg/image";
import {DownloadOptions} from "./downloadrequest";
import {ImageCollection} from "../gg/imagecollection";
import {GGObject} from "../gg/ggobject";

export interface PostMapIdResponse {
  mapId: string;
}

export interface ImageInfo {
  name: string;
  acquiredAt: Date;
}

export interface ImageCollectionInfo {
  images: ImageInfo[];
}

/**
 * Web API
 */
export class API {
  static HOST: string = "http://engine.gagogroup.cn/api/v1";
  static RENDERER_HOST: string = "http://engine-renderer.gagogroup.cn";
  static token: string = "";

  static init(host: string, renderHost: string): void {
    API.HOST = host;
    
    if(renderHost) {
      API.RENDERER_HOST = renderHost;
    }
  }

  /**
   * 提交一个影像
   *
   * @param {GGObject} ggObject
   * @param {ImageVisualizationParameters} visParams
   * @returns {Promise<PostMapIdResponse>}
   */
  static async addImageLayer(ggObject: GGObject, visParams: ImageVisualizationParameters): Promise<PostMapIdResponse> {
    let postData: any = {
      imageId: ggObject.assetId,
      imageVisualizationParameters: visParams,
      imageTags: ggObject.tags
    };

    if (ggObject.collectionFilter.start) {
      postData = Object.assign(postData, {startAt: ggObject.collectionFilter.start});
    }

    if (ggObject.collectionFilter.end) {
      postData = Object.assign(postData, {endAt: ggObject.collectionFilter.end});
    }

    if (ggObject.collectionFilter.region) {
      postData = Object.assign(postData, {region: ggObject.collectionFilter.region.toCoordinates()});
    }

    if (ggObject.collectionFilter.returnFirst) {
      postData = Object.assign(postData, {returnFirst: ggObject.collectionFilter.returnFirst});
    }

    if (ggObject.collectionFilter.cloud) {
      postData = Object.assign(postData, {cloud: ggObject.collectionFilter.cloud});
    }

    const res: Response = await POST_(`mapid`, postData);
    const responseJson: any = await res.json();
    return {
      mapId: responseJson["data"]["mapId"]
    };
  }

  /**
   * 生成一个下载打包好的图像的链接
   *
   * POST /doc
   *
   * @param image 图像
   * @param downloadOptions 下载参数
   * @returns {Promise<string>} 打包好的下载图像的链接
   */
  static async getImageDownloadUrl(image: Image, downloadOptions: DownloadOptions): Promise<string> {
    const mergeDownloadOptions: DownloadOptions = Object.assign({}, image.defaultDownloadOptions, downloadOptions);

    const postData: any = {
      imageId: image.assetId,
      scale: mergeDownloadOptions.scale,
      crs: mergeDownloadOptions.crs,
      region: mergeDownloadOptions.region.toCoordinates(),
      startAt: mergeDownloadOptions.startAt,
      endAt: mergeDownloadOptions.endAt,
      selectedBands: image.selectedBands,
      tags: image.tags
    };

    const res: Response = await POST_(`doc`, postData);
    const responseJson: any = await res.json();

    return responseJson["data"]["downloadUrl"];
  }

  /**
   * 准备数据
   * @param {ImageCollection} imageCollection 需要准备数据的 image collection
   * @param {string} recvEmail 完成后的通知
   * @returns {Promise<number>} 影像需要准备的幅数
   */
  static async prepareImageCollection(imageCollection: ImageCollection, recvEmail: string): Promise<number> {
    const postData: any = {
      satelliteSensorId: imageCollection.assetId,
      startAt: imageCollection.collectionFilter.start,
      endAt: imageCollection.collectionFilter.end,
      region: imageCollection.collectionFilter.region.toCoordinates(),
      cloud: imageCollection.collectionFilter.cloud,
      email: recvEmail
    };

    const res: Response = await POST_(`data_preparation`, postData);
    const responseJson: any = await res.json();

    return responseJson["data"]["quantity"];
  }

  /**
   * 过滤 collection 的数据并且获取结果，用于 print(ImageCollection)
   */
  static async queryCollectionInfo(imageCollection: ImageCollection): Promise<ImageCollectionInfo> {
    const coordinatesStr: string = imageCollection.collectionFilter.region.toCoordinatesString();
    const startAt: Date = imageCollection.collectionFilter.start;
    const endAt: Date = imageCollection.collectionFilter.end;
    const cloud: number = imageCollection.collectionFilter.cloud;
    const id: string = imageCollection.assetId;
    const uri: string = `image/filter?region=${coordinatesStr}&start_at=${startAt}&end_at=${endAt}&cloud_cover=${cloud}&satellite_id=${id}`;

    const res: Response = await GET_(uri);
    return await res.json();
  }
}

async function POST_(uri: string, body: any): Promise<Response> {
  return await fetch(`${API.HOST}/${uri}`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "Token": API.token
    }),
    mode: "cors",
    body: JSON.stringify(body)
  });
}

async function GET_(uri: string): Promise<Response> {
  return await fetch(`${API.HOST}/${uri}`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      "Token": API.token
    }),
    mode: "cors"
  });
}
