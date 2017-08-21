// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: 使用 Sentinel 构建 NDVI

// @code-begin

// 苏州地区
var region = gg.GeometryFactory.rectangle([
  [118.322265625, 33.316101383495624],
  [122.322265625, 29.316101383495624]
]);

var sentinel2 = gg.ImageFactory.imageCollection("sentinel-2")
  .filterDate("2017-06-21", "2017-07-01") // 日期
  .filterBounds(region)
  .first();

var ndvi = sentinel2.normalizedDifference(["B08", "B03"]); // 实际应该是 B04，暂时没有 B04 的图片
var vizParams = {
  palette: ["#FFFFFF", "#CE7E45", "#DF923D", "#F1B555", "#FCD163", "#99B718","#74A901", "#66A000", "#529400", "#3E8601", "#207401", "#056201","#004C00", "#023B01", "#012E01", "#011D01", "#011301"],
  opacity: 100
};

Map.setCenter(120.322265625, 31.316101383495624, 12);
Map.addLayer(ndvi, vizParams);

// @code-end