// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: 查询 Sentinel 的图像信息

// @code-begin

// 蒙草地区范围 (通过左上角经纬度、右下角经纬度来指定)
var region = gg.GeometryFactory.rectangle([
  [116.156, 45.408],
  [119.342, 43.832]
]);

// 筛选出 sentinel-2 在指定日期、指定范围的图像
// 注: 仅取出最合适的部分来做 NDVI (注: ImageCollection 无法做 normalizedDifference 操作，需要转换成 Image)
var sentinel2 = gg.ImageFactory.imageCollection("sentinel-2")
  .filterDate("2017-07-01", "latest") // 日期 (注: 从2017年1月起至今有数据，哪天有数据可以咨询@杨康)
  .filterBounds(region)
  .filterCloud(20);

// 在右侧输出影像的具体信息
print(sentinel2);

// @code-end