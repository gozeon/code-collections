// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as mapboxgl from "mapbox-gl";
import * as ui from "engine-ui";

import {GGObject} from "../../gg/ggobject";
import {Layer} from "./layer";
import {ImageVisualizationParameters} from "./types";
import {API, PostMapIdResponse} from "../../api/api";
import {Point} from "../../gg/geometry/point";

(<any>mapboxgl).accessToken = "pk.eyJ1Ijoiamlhbmd3ZWkiLCJhIjoiY2oxYnV0aHJ4MGIwMTJxcDlqMml5NHpheCJ9.kDyyi2SmB5B9R3YsnTw1Rg";


export type MapStyle = "mapbox_streets" | "mapbox-light";

const DEFAULT_CENTER: Point = new Point(-122.447303, 37.753574);
const DEFAULT_ZOOM_LEVEL: number = 12;
const MIN_ZOOM: number = 10;

/**
 * 地图事件代理
 */
export interface MapEventDelegate {

  /**
   * 图层将要被加载，需要注意不一定能加载成功
   * @param {Layer} layer 图层
   */
  layerWillAdd?: (layer: Layer) => void;

  /**
   * 图层已经被加载成功的回调
   * @param {Layer} layer 图层
   */
  layerDidAdd?: (layer: Layer) => void;
}

/**
 * Map API
 */
export class Map {
  static instance: mapboxgl.Map;
  static layers: Layer[] = [];

  static delegate?: MapEventDelegate;

  static panelElements: HTMLElement[] = [];

  /**
   * init(): void
   *
   * Init Map
   * @return void
   */
  static init(style: MapStyle = "mapbox_streets"): void {
    Map.instance = new mapboxgl.Map({
      container: "map", // container id
      style: Map.styleUrl_(style), //stylesheet location
      center: [-122.447303, 37.753574], // starting position (Beijing, China)
      zoom: 13 // starting zoom
    });
  }

  /**
   * 重置地图
   */
  static reset(): void {
    // remove all layers
    for (let layer of Map.layers) {
      Map.instance.removeLayer(layer.id);
    }

    // zoom to default center
    Map.setCenter(DEFAULT_CENTER.x, DEFAULT_CENTER.y, DEFAULT_ZOOM_LEVEL);

    // remove all existing panels
    Map.removeAllPanels();
  }

  /**
   * setCenter(lon: number, lat: number, zoom: number): void
   *
   * Sets center
   * @param lon Longitude
   * @param lat Latitude
   * @param zoom Zoom level
   * @return void
   */
  static setCenter(lon: number, lat: number, zoom: number): void {
    Map.instance.setCenter([lon, lat]);
    Map.instance.zoomTo(zoom);
  }

  /**
   * addLayer(ggObject: GGObject, visParams?: ImageVisualizationParameters): Layer
   *
   * Adds layer to map
   * @param ggObject Subclass of GGObject
   * @param visParams ImageVisualizationParameters
   * @param name Layer name shown on "layer" (HTML)
   * @returns {Layer} Map Layer
   */
  static async addLayer(ggObject: GGObject, visParams?: ImageVisualizationParameters, name?: string): Promise<void> {
    const sourceId: string = `${Map.layers.length + 1}`;
    const layerId: string = sourceId;

    let layer: Layer = new Layer(layerId);
    layer.name = name ? name : ggObject.assetId;
    Map.layers.push(layer);

    if (Map.delegate && Map.delegate.layerWillAdd) {
      Map.delegate.layerWillAdd(layer);
    }

    const res: PostMapIdResponse = await API.addImageLayer(ggObject, Object.assign({}, ggObject.defaultVizParams, visParams));

    if (Map.delegate && Map.delegate.layerDidAdd) {
      Map.delegate.layerDidAdd(layer);
    }

    Map.instance.addSource(sourceId, ggObject.mapboxglSource(res.mapId));
    Map.instance.addLayer(ggObject.mapboxglLayer(layerId, sourceId));
  }

  /**
   * 设置图层透明度
   * @param {string} layerId 图层 ID
   * @param {number} opacity 透明度，0 - 1
   */
  static setLayerOpacity(layerId: string, opacity: number): void {
    Map.instance.setPaintProperty(layerId, "raster-opacity", opacity);
  }

  /**
   * 隐藏图层
   * @param {string} layerId 图层 ID
   */
  static hideLayer(layerId: string): void {
    Map.instance.setLayoutProperty(layerId, "visibility", "none");
  }

  /**
   * 显示图层
   * @param {string} layerId 图层 ID
   */
  static showLayer(layerId: string): void {
    Map.instance.setLayoutProperty(layerId, "visibility", "visible");
  }

  /**
   * 添加面板
   */
  static addPanel(panel: ui.Panel): void {
    let panelElement: HTMLElement = document.querySelector("#map").appendChild(panel.node().html);
    Map.panelElements.push(panelElement);
  }

  /**
   * 删除掉所有的 Panel
   */
  static removeAllPanels(): void {
    for (let element of Map.panelElements) {
      document.querySelector("#map").removeChild(element);
    }
    Map.panelElements = [];
  }

  private static styleUrl_(style: MapStyle): string {
    if (style === "mapbox_streets") {
      return "mapbox://styles/mapbox/streets-v9";
    } else if (style === "mapbox-light") {
      return "mapbox://styles/mapbox/light-v9";
    } else {
      throw new Error(`Undefined style ${style}`);
    }
  }
}
