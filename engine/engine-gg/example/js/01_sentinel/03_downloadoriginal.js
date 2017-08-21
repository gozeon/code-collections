// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: 下载 Sentinel 原始影像

// @code-begin

// 苏州地区
var region = gg.GeometryFactory.rectangle([
  [118.322265625, 33.316101383495624],
  [122.322265625, 29.316101383495624]
]);

var sentinel2Image = gg.ImageFactory.imageCollection("sentinel-2") // 高分1的 WFV 传感器
  .filterDate("2017-06-21", "2017-07-01") // 日期
  .filterBounds(region)
  .first();

var sentinel2ImageToDownload = sentinel2Image.select(["B08", "B03"]);

var path = sentinel2ImageToDownload.getDownloadUrl({
  region: region
});

print(path); // 该函数暂时需要4分钟左右的时间

// @code-end
