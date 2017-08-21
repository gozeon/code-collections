import * as gg from 'engine-api';
import { mapEventDelegate } from './layer';
const MapboxDraw = require('../../../node_modules/@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw');
import JSONFormatter from 'json-formatter-js';

(<any>window).gg = gg;
(<any>window).Map = gg.Map;
(<any>window).Map.init();
(<any>window).Map.delegate = mapEventDelegate;

if ((<any>window).Map.layers <= 0) {
  $('div#layerBar').hide();
}

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    point: true,
    line_string: true,
    polygon: true,
    trash: true
  },
  keybindings: false
});

(<any>window).Map.instance.addControl(draw, 'top-left');

(<any>window).Map.instance.on('draw.create', function (e) {
  showFeatures(draw.getAll());
});

(<any>window).Map.instance.on('draw.update', function (e) {
  showFeatures(draw.getAll());
});

(<any>window).Map.instance.on('draw.delete', function (e) {
  showFeatures(draw.getAll());
});

const showFeatures = (featureCollection: any) => {
  $('#features').empty();
  if (featureCollection.features.length == 0) {
    (<any>window).geometry = undefined;
    return;
  }
  const formatter = new JSONFormatter(featureCollection);
  (<any>window).geometry = featureCollection;

  $('#features').append(formatter.render());
  $('#features').find('span.json-formatter-constructor-name').first().text('var geometry: Object');
}
