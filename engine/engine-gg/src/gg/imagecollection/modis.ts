// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ImageCollection} from "../imagecollection";
import {DateUtils} from "../../utils/dateutils";
import {GeometryFactory} from "../geometry/geometryfactory";

const region = GeometryFactory.rectangle([
  [116.156, 43.832],
  [119.342, 45.408]
]);

const modis: ImageCollection = new ImageCollection("MODIS/051/MYD13Q1");
modis.init({
  defaultVizParams: {
    bands: ["B04", "B03", "B02"],
    opacity: 100,
    format: "png"
  },

  defaultDownloadOptions: {
    name: "MODIS/051/MYD13Q1",
    scale: 30,
    crs: "EPSG:4326",
    startAt: DateUtils.monthsAgo(new Date(), 1),
    endAt: new Date(),
    region: region
  },

  availableBands: ["B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B8A", "B09", "B10", "B11", "B12"]
});

export const MODIS = modis;
