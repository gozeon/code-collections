// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: 浏览 Sentinel

// @code-begin

// 苏州地区
var region = gg.GeometryFactory.rectangle([
  [118.322265625, 33.316101383495624],
  [122.322265625, 29.316101383495624]
]);

var sentinel2 = gg.ImageFactory.imageCollection("sentinel-2")
  .filterDate("2017-06-21", "2017-07-01") // 日期
  .filterBounds(region);

var vizParams = {
  bands: ["B08", "B03", "B02"],
  opacity: 100
};

Map.setCenter(120.322265625, 31.316101383495624, 12);
Map.addLayer(sentinel2, vizParams);

// @code-end