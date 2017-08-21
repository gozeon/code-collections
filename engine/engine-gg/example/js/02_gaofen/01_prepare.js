// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: 预准备高分1号数据

// @code-begin

// 加载高分1号图像 (蒙草中西乌旗范围)
var region = gg.GeometryFactory.rectangle([
  [116.156, 43.832],
  [119.342, 45.408]
]);

var gfCollection = gg.ImageFactory.imageCollection("GF1/WFV") // 高分1的 WFV 传感器
  .filterDate("2017-06-21", "2017-07-01") // 日期
  .filterBounds(region);

gfCollection.prepare("your email address goes for here"); // 准备高分数据

// 准备数据后在查收邮件后可以参考"显示高分数据"的示例来加载地图

// @code-end
