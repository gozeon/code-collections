// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * Sentinel-2
 *
 Sentinel-2 Bands	Central Wavelength (µm)	Resolution (m)	Bandwidth (nm)
 Band 1 – Coastal aerosol	0.443	60	20
 Band 2 – Blue	0.490	10	65
 Band 3 – Green	0.560	10	35
 Band 4 – Red	0.665	10	30
 Band 5 – Vegetation Red Edge	0.705	20	15
 Band 6 – Vegetation Red Edge	0.740	20	15
 Band 7 – Vegetation Red Edge	0.783	20	20
 Band 8 – NIR	0.842	10	115
 Band 8A – Narrow NIR	0.865	20	20
 Band 9 – Water vapour	0.945	60	20
 Band 10 – SWIR – Cirrus	1.375	60	20
 Band 11 – SWIR	1.610	20	90
 Band 12 – SWIR	2.190	20	180
 */

import {ImageCollection} from "../imagecollection";
import {DateUtils} from "../../utils/dateutils";
import {GeometryFactory} from "../geometry/geometryfactory";

const region = GeometryFactory.rectangle([
  [116.156, 43.832],
  [119.342, 45.408]
]);

const sentinel2: ImageCollection = new ImageCollection("sentinel-2");
sentinel2.init({
  defaultVizParams: {
    bands: ["B04", "B03", "B02"],
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

  availableBands: ["B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B8A", "B09", "B10", "B11", "B12"]
});

export const SENTINEL2 = sentinel2;
