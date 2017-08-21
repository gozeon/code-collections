// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ImageVisualizationParameters} from "../../ui/map/types";
/**
 * Every object that can be shown on mapboxgl is MapboxConvertable.
 */
export interface MapboxConvertable {
  id: string;

  defaultVisParams: ImageVisualizationParameters;

  mapboxSource(mapId: string): mapboxgl.VectorSource | mapboxgl.RasterSource;

  mapboxLayer(id: string, sourceId: string): mapboxgl.Layer;
}
