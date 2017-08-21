import * as ui from '../src';

const legend = new ui.Panel({
  style: {
    padding: "6px",
    position: "top-right"
  }
});
const title = new ui.Label({
  value: "标题",
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
const names = ["红色", "绿色", "蓝色"];
for (let i = 0; i < 3; i++) {
  legend.add(makeRow(palette[i], names[i]));
}
document.querySelector("#map").appendChild(legend.node().html);
