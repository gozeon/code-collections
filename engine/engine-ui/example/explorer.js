import * as ui from '../src';

const titleLabel = new ui.Label({
  value: "Landsat 8 Explorer",
  style: {fontWeight: "bold", fontSize: "24px", margin: "10px 5px"}
});

const descriptionLabel = new ui.Label({
  value: "This app allows you to filter and export images " +
  "from the Landsat 8 collection."
});

const startDate = new ui.Textbox({
  name: 'startDate',
  format: "YYYY-MM-DD",
  value: "2017-07-01"
});
const endDate = new ui.Textbox({
  name: 'endDate',
  format: "YYYY-MM-DD",
  value: "2017-07-05"
});
const applyButton = new ui.Button({
  text: "Apply filters ",
  click: () => {
    console.log(startDate.getValue(), endDate.getValue());
  }
});

const panel = new ui.Panel({
  widgets: [titleLabel, descriptionLabel, startDate, endDate, applyButton],
  layout: "vertical",
  style: {
    position: "bottom-left",
    padding: "5px 8px"
  }
});
document.querySelector("#map").appendChild(panel.node().html);

