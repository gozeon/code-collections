// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: 测试(浏览蒙草)

// @code-begin

// 蒙草地区范围
var region = gg.GeometryFactory.rectangle([
  [118.29253204,46.05357437],
  [118.30,46.04]
]);

var sentinel2 = gg.ImageFactory.imageCollection("sentinel-2")
  .filterDate("2017-07-01", "latest")
  .filterBounds(region)
  .first();

var vizParams = {
  bands: ["B08", "B03", "B02"]
};

// 在地图上显示
Map.setCenter(118.29253204,46.05357437, 12);
Map.addLayer(sentinel2, vizParams);

// @code-end
