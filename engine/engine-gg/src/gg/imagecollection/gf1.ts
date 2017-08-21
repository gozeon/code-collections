// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * 高分1号 WFV 传感器
 *
 GF-1卫星轨道参数
 轨道类型	太阳同步回归轨道
 轨道高度	645km
 轨道倾角	98.0506°
 降交点地方时	10:30 AM
 回归周期	41天

 GF-1卫星有效载荷参数
 谱段号	谱段范围 (µm)	空间分辨率 (m)	幅宽(km)	侧摆能力	重访时间(天）
 全色多光谱相机
 1	0.45～0.90
 2	60（2台相机组合）±35°
 4
 多光谱相机	6	0.45～0.52	16	800
 （4台相机组合）		2
 2	0.45～0.52	8
 3	0.52～0.59
 4	0.63～0.69
 5	0.77～0.89
 */

import {ImageCollection} from "../imagecollection";
import {DateUtils} from "../../utils/dateutils";
import {GeometryFactory} from "../geometry/geometryfactory";

const gf1Wfv: ImageCollection = new ImageCollection("GF1/WFV");

const region = GeometryFactory.rectangle([
  [116.156, 43.832],
  [119.342, 45.408]
]);

gf1Wfv.init({
  defaultVizParams: {
    bands: ["B1", "B2", "B3"],
    opacity: 100,
    format: "png"
  },
  defaultDownloadOptions: {
    name: "gaofen1",
    scale: 30,
    crs: "EPSG:4326",
    startAt: DateUtils.monthsAgo(new Date(), 1),
    endAt: new Date(),
    region: region
  },
  availableBands: ["B1", "B2", "B3", "B4"]
});
gf1Wfv.shouldPrepare = true; // 需要预先准备数据才能下载

export const GF1WFV = gf1Wfv;
