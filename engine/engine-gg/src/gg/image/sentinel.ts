// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Image} from "../image";
import {DateUtils} from "../../utils/dateutils";
import {GeometryFactory} from "../geometry/geometryfactory";

const region = GeometryFactory.rectangle([
  [116.156, 43.832],
  [119.342, 45.408]
]);

const sentinel: Image = new Image("sentinel");
sentinel.init({
  defaultVizParams: {
    bands: ["B08", "B03", "B02"],
    opacity: 100,
    format: "png"
  },
  defaultDownloadOptions: {
    name: "sentinel-2",
    scale: 30,
    crs: "EPSG:4326",
    startAt: DateUtils.monthsAgo(new Date(), 1),
    endAt: new Date(),
    region: region
  },
  availableBands: ["B03", "B02", "B08"]
});
sentinel.selectedBands = sentinel.availableBands;

export const SENTINEL = sentinel;
