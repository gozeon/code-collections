// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {GGObject, GGObjectType} from "./ggobject";
import {ImageVisualizationParameters} from "../ui/map/types";
import {DownloadOptions, DownloadRequest} from "../api/downloadrequest";
import {CollectionFilter} from "./imagecollection";

/**
 * 初始化遥感影像时要执行的协议
 */
export interface ImageProtocol {
  onMapboxglSource?: (mapId: string) => mapboxgl.RasterSource;
  onMapboxglLayer?: (id: string, sourceId: string) => mapboxgl.Layer;
  defaultVizParams: ImageVisualizationParameters;
  defaultDownloadOptions: DownloadOptions;
  availableBands: string[];
}

/**
 * Image of engine.
 */
export class Image extends GGObject {

  type: GGObjectType = GGObjectType.IMAGE;

  /**
   * 选择的波段，配合 select 使用
   * @type {Array}
   */
  selectedBands: string[] = [];

  clone(): Image {
    return Object.assign({}, this, Image.prototype, GGObject.prototype);
  }

  // ---------- Public Methods ----------

  /**
   * 做归一化 (A - B) / (A + B)
   * @param {string[]} bands A波段以及B波段
   * @returns {Image} 影像对象
   */
  normalizedDifference(bands: string[2]): Image {
    const newImage: Image = this.clone();
    newImage.tags.push({
      functionName: "Image.normalizedDifference",
      parameters: [bands[0], bands[1]]
    });
    return newImage;
  }

  /**
   * 获取下载的链接
   * @param {DownloadOptions} options 下载的选项
   * @returns {DownloadRequest} 下载的请求，调用 print() 后可以输出路径
   */
  getDownloadUrl(options: DownloadOptions): DownloadRequest {
    return new DownloadRequest(this, options);
  }

  /**
   * 选择波段
   * @param {string[]} bands 波段
   * @returns {Image} 选择波段后的图片
   */
  select(bands: string[]): Image {
    const newImage: Image = this.clone();
    newImage.selectedBands = bands;
    return newImage;
  }

  /**
   * 分类
   * @param {string} sldXml SLD style XML，例如:
   *
   * '<RasterSymbolizer>' +
   ' <ColorMap  type="intervals" extended="false" >' +
   '<ColorMapEntry color="#aec3d4" quantity="0" label="Water"/>' +
   '<ColorMapEntry color="#152106" quantity="1" label="Evergreen Needleleaf Forest"/>' +
   '<ColorMapEntry color="#225129" quantity="2" label="Evergreen Broadleaf Forest"/>' +
   '<ColorMapEntry color="#369b47" quantity="3" label="Deciduous Needleleaf Forest"/>' +
   '<ColorMapEntry color="#30eb5b" quantity="4" label="Deciduous Broadleaf Forest"/>' +
   '<ColorMapEntry color="#387242" quantity="5" label="Mixed Deciduous Forest"/>' +
   '<ColorMapEntry color="#6a2325" quantity="6" label="Closed Shrubland"/>' +
   '<ColorMapEntry color="#c3aa69" quantity="7" label="Open Shrubland"/>' +
   '<ColorMapEntry color="#b76031" quantity="8" label="Woody Savanna"/>' +
   '<ColorMapEntry color="#d9903d" quantity="9" label="Savanna"/>' +
   '<ColorMapEntry color="#91af40" quantity="10" label="Grassland"/>' +
   '<ColorMapEntry color="#111149" quantity="11" label="Permanent Wetland"/>' +
   '<ColorMapEntry color="#cdb33b" quantity="12" label="Cropland"/>' +
   '<ColorMapEntry color="#cc0013" quantity="13" label="Urban"/>' +
   '<ColorMapEntry color="#33280d" quantity="14" label="Crop, Natural Veg. Mosaic"/>' +
   '<ColorMapEntry color="#d7cdcc" quantity="15" label="Permanent Snow, Ice"/>' +
   '<ColorMapEntry color="#f7e084" quantity="16" label="Barren, Desert"/>' +
   '<ColorMapEntry color="#6f6f6f" quantity="17" label="Tundra"/>' +
   '</ColorMap>' +
   '</RasterSymbolizer>';
   *
   */
  sldStyle(sldXml: string): Image {
    const newImage: Image = this.clone();
    newImage.tags.splice(0, 0, {
      functionName: "Image.sldXml",
      parameters: [sldXml]
    });
    return newImage;
  }
}
