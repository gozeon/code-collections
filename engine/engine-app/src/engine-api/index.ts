import * as gg from 'engine-api';
import * as ui from 'engine-ui';
import './ui';
import './map';

import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import '../../node_modules/@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

gg.API.init(__API__, 'http://engine-render.gagogroup.cn/api/v1');
(<any>window).ui = ui;
