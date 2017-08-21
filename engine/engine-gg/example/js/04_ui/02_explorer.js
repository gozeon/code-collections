// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: Sentinel-2 浏览器

// @code-begin

var app = {};

app.createPanel = function () {
  const titleLabel = new ui.Label({
    value: "Landsat 8 Explorer",
    style: { fontWeight: "bold", fontSize: "24px", margin: "10px 5px" }
  });

  const descriptionLabel = new ui.Label("This app allows you to filter and export images " +
    "from the Landsat 8 collection.");

  const startDate = new ui.Textbox({
    name: 'startDate',
    format: "YYYY-MM-DD",
    value: "2017-07-01"
  });

  const endDate = new ui.Textbox({
    name: 'endDate',
    format: "YYYY-MM-DD",
    value: "2017-07-01"
  });

  const applyButton = new ui.Button({
    text: "Apply filters ",
    click: app.applyFilters
  });

  const panel = new ui.Panel({
    widgets: [titleLabel, descriptionLabel, startDate, endDate, applyButton],
    layout: "vertical",
    style: {
      position: "bottom-left",
      padding: "5px 8px"
    }
  });

  Map.addPanel(panel);
};

app.applyFilters = function () {
  var start = app.filters.startDate.getValue();
  var end = app.filters.startDate.getValue();

  // 苏州地区
  var region = gg.GeometryFactory.rectangle([
    [118.322265625, 33.316101383495624],
    [122.322265625, 29.316101383495624]
  ]);

  var sentinel2 = gg.ImageFactory.imageCollection("sentinel-2")
    .filterDate(start, end) // 日期
    .filterBounds(region);

  var vizParams = {
    bands: ["B08", "B03", "B02"],
    opacity: 100
  };

  Map.setCenter(120.322265625, 31.316101383495624, 12);
  Map.addLayer(sentinel2, vizParams);
};

app.createPanel();

// @code-end