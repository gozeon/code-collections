// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: 使用 Sentinel 构建 NDVI

// @code-begin

// 蒙草地区范围 (通过左上角经纬度、右下角经纬度来指定)
var region = gg.GeometryFactory.rectangle([
  [116.156, 43.832],
  [119.342, 45.408]
]);

// 筛选出 sentinel-2 在指定日期、指定范围的图像
// 注: 仅取出最合适的部分来做 NDVI (注: ImageCollection 无法做 normalizedDifference 操作，需要转换成 Image)
var sentinel2 = gg.ImageFactory.imageCollection("sentinel-2")
  .filterDate("2017-07-01", "latest") // 日期 (注: 从2017年1月起至今有数据，哪天有数据可以咨询@杨康)
  .filterBounds(region)
  .filterCloud(20)
  .first();

// (NIR - RED) / (NIR + RED)
var ndvi = sentinel2.normalizedDifference(["B08", "B04"]);

// 等分显示的颜色值
var vizParams = {
  palette: ["#FFFFFF", "#CE7E45", "#DF923D", "#F1B555", "#FCD163", "#99B718","#74A901", "#66A000", "#529400", "#3E8601", "#207401", "#056201","#004C00", "#023B01", "#012E01", "#011D01", "#011301"],
  opacity: 100
};

// 在地图上显示
Map.setCenter(118.249, 44.62, 12);
Map.addLayer(ndvi, vizParams);

// @code-end