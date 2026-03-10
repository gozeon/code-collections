// In the Name of God, the Originator the Creative

// app.js for concatenation of smaller libraryies
// to reduce http requests of small files

// Prefetch in-viewport links during idle time
import { listen } from "quicklink/dist/quicklink.mjs";
listen();

// lazy sizes for image loading
// TODO: use lazysizes in all pages
import "lazysizes";
import "lazysizes/plugins/aspectratio/ls.aspectratio.js";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
function initLazysizes() {
  var docElem = document.documentElement;

  window.lazySizesConfig = window.lazySizesConfig || {};

  window.lazySizesConfig.loadMode = 1;

  //set expand to a higher value on larger displays
  window.lazySizesConfig.expand = Math.max(Math.min(docElem.clientWidth, docElem.clientHeight, 1222) - 1, 359);
  window.lazySizesConfig.expFactor = lazySizesConfig.expand < 380 ? 3 : 2;
}
initLazysizes();

// global alert
import "./assets/js/alert";

import "./script";

// import "./form-handler";
