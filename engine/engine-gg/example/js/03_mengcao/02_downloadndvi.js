// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: 下载 Sentinel NDVI 图像

// @code-begin

// 加载 Sentinel-2 (蒙草中西乌旗范围)
var region = gg.GeometryFactory.rectangle([
  [118.08875,45.5984],
  [118.28875,45.3984]
]);

// 选出 Sentinel-2 符合地域、日期的最优图片以便于之后做 NDVI
var sentinel2Img = gg.ImageFactory.imageCollection("sentinel-2")
  .filterDate("2017-07-20", "2017-07-27") // 日期
  .filterBounds(region)
  .first();

// 处理成 NDVI
var ndvi = sentinel2Img.normalizedDifference(["B08", "B04"]);

// 下载蒙草的图像
var path = ndvi.getDownloadUrl({
  scale: 30,
  region: region
});

print(path);

// @code-end
