// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: 为地图添加图例

// @code-begin

const legend = new ui.Panel({
  style: {
    padding: "6px",
    position: "bottom-left"
  }
});

const title = new ui.Label({
  value: "图例",
  style: {
    fontWeight: "bold",
    fontSize: "18px",
    margin: "0 0 4px 0",
    padding: "0px"
  }
});

legend.add(title);

const makeRow = (color, name) => {
  const colorBox = new ui.Label({
    style: {
      backgroundColor: `#${color}`,
      padding: "8px",
      margin: "0 4px 4px 0"
    }
  });

  const description = new ui.Label({
    value: name,
    style: {
      margin: "0 0 4px 0"
    }
  });

  return new ui.Panel({
    widgets: [colorBox, description],
    layout: "horizontal"
  });
};

const palette = ["FF0000", "22ff00", "1500ff"];
const names = ["沙漠", "海洋", "火山"];
for (var i = 0; i < palette.length; i++) {
  legend.add(makeRow(palette[i], names[i]));
}

Map.addPanel(legend);

// @code-end