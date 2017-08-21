// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: 浏览准备好的高分1号数据(真彩色)

// @code-begin

// 加载高分1号图像 (蒙草中西乌旗范围)
var region = gg.GeometryFactory.rectangle([
  [116.156, 43.832],
  [119.342, 45.408]
]);

var gfCollection = gg.ImageFactory.imageCollection("GF1/WFV") // 高分1的 WFV 传感器
  .filterDate("2017-06-21", "2017-07-01") // 日期
  .filterBounds(region);

var vizParams = {
  bands: ["B3", "B2", "B1"],
  opacity: 100
};

Map.setCenter(118.7022919,  45.5450411, 12);
Map.addLayer(gfCollection, vizParams);

// @code-end
