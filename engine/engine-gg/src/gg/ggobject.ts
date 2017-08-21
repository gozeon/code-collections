// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as mapboxgl from "mapbox-gl";
import {ImageVisualizationParameters} from "../ui/map/types";
import {API} from "../api/api";
import {ImageProtocol} from "./image";
import {CollectionFilter} from "./imagecollection";
import {DownloadOptions} from "../api/downloadrequest";

/**
 * GGObjectType.
 * @public
 */
export enum GGObjectType {
  IMAGE,
  IMAGE_COLLECTION
}

/**
 * 用于记录遥感图像处理的标记
 */
export interface Tag {
  functionName: string;
  parameters: string[];
}

/**
 * 影像对象需要继承于此，包含 Image, ImageCollection
 */
export abstract class GGObject {
  abstract type: GGObjectType;

  assetId: string;

  /**
   * 处理的标记
   */
  tags: Tag[] = [];

  /**
   * 默认可视化参数，当 Map.addLayer(xx); 时使用在第二个参数上
   */
  defaultVizParams: ImageVisualizationParameters;

  /**
   * 默认下载的参数
   */
  defaultDownloadOptions: DownloadOptions;

  /**
   * 所有的波段
   */
  availableBands: string[];

  /**
   * ImageCollection 的过滤器
   *
   * ImageCollection 都有该属性
   * Image 仅在 ImageCollection.filter(xxx).first() 时返回的 Image 才具备该属性
   */
  collectionFilter: CollectionFilter = {};

  /**
   * 在此函数返回 mapboxgl 要求的 source
   * @param mapId 服务端返回的 mapId，通过 API.addImageLayer 获得
   */
  onMapboxglSource = (mapId: string): mapboxgl.RasterSource => {
    return <any>{
      "type": "raster",
      "tiles": [`${API.RENDERER_HOST}/map/${mapId}/{z}/{x}/{y}`],
      "tileSize": 256,
      "minzoom": 10
    }
  };

  /**
   * 在此函数返回 mapboxgl 要求的 layer
   */
  onMapboxglLayer = (id: string, sourceId: string): mapboxgl.Layer => {
    return {
      "id": id,
      "type": "raster",
      "source": sourceId
    };
  };

  constructor(assetId: string) {
    this.assetId = assetId;
  }

  init(imageProtocol: ImageProtocol): void {
    if (imageProtocol.onMapboxglSource) {
      this.onMapboxglSource = imageProtocol.onMapboxglSource;
    }

    if (imageProtocol.onMapboxglLayer) {
      this.onMapboxglLayer = imageProtocol.onMapboxglLayer;
    }

    this.defaultVizParams = imageProtocol.defaultVizParams;

    this.defaultDownloadOptions = imageProtocol.defaultDownloadOptions;

    this.availableBands = imageProtocol.availableBands;
  }

  mapboxglSource(mapId: string): mapboxgl.RasterSource {
    return this.onMapboxglSource(mapId);
  }

  mapboxglLayer(id: string, source: string): mapboxgl.Layer {
    return this.onMapboxglLayer(id, source);
  }
}
